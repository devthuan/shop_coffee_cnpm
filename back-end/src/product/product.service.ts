import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { ProductAttributes } from './entities/productAttributes.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { Images } from './entities/images.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { AttributeService } from 'src/attribute/attribute.service';
import { CommonException } from 'src/common/exception';
import { BaseService } from 'src/common/baseService';
import { UpdateProductDto } from './dto/update-product.dto';
import { BillService } from 'src/bill/bill.service';
import { ImportReceiptService } from 'src/import_receipt/import_receipt.service';

interface StatisticalReview {
    averageRating: number | 0; // or a suitable type based on your rating system
    totalReview: number | 0;
    total5Reviews: number | 0;
    total4Reviews: number | 0;
    total3Reviews: number | 0;
    total2Reviews: number | 0;
    total1Reviews: number | 0;
    
}


@Injectable()
export class ProductService extends BaseService<Products> {
  
  
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  
    @InjectRepository( ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,
    @InjectRepository(ProductDiscount)
    private readonly productDiscountRepository: Repository<ProductDiscount>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    

    private readonly categoryService: CategoriesService,
    private readonly attributeService: AttributeService,

    @Inject(forwardRef(() =>BillService))
    private  billService: BillService,

    @Inject(forwardRef(() =>ImportReceiptService))
    private  importReceiptService: ImportReceiptService,
    
    private readonly cloudinaryService: CloudinaryService,
    
    private readonly dataSource: DataSource
  ){
    super(productRepository)
  }
  
  async createProduct(files : Array<Express.Multer.File>, createProductDto: CreateProductDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      // initial transaction
      await queryRunner.connect()
      await queryRunner.startTransaction();

      // check existing product
      if (await this.checkExisting({name: createProductDto.name})) {
        throw new ConflictException('Product name already exists');
      }

      // check existing category
      const existingCategory = await this.categoryService.findOne(createProductDto.categoryId)
      if (!existingCategory) {
        throw new NotFoundException('Category not found');
      }
      
      // create product
      const newProduct = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        category: existingCategory
      });
      await queryRunner.manager.save(newProduct);


      // create product attribute
      if(createProductDto.attributes.length > 0) {
        for(const attribute of createProductDto.attributes) {
          const existingAttribute = await this.attributeService.findOne(attribute.attributeId);
          if (!existingAttribute) {
            throw new NotFoundException('Attribute not found');
          }
  
           const newProductAttributeValue = await this.productAttributesRepository.create({
              sellPrice: 0,
              buyPrice: 0,
              quantity: 0,
              attributes: existingAttribute,
              products: newProduct
            })
            await queryRunner.manager.save(newProductAttributeValue);
          
        }

      }else {
        throw new BadRequestException('Missing attribute.')
      }
      
      // init images product
      if(files && files.length > 0){
        for(const file of files){
          const uploadedFile = await this.uploadFileCloudinary(file);
          const newImages =  this.imagesRepository.create({
            urlImage: uploadedFile,
            products: newProduct
          })
          queryRunner.manager.save(newImages);

        }
      }

      // commit transaction
      await queryRunner.commitTransaction();
      return { message: 'Product created successfully' };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      CommonException.handle(error);
    } finally{
      await queryRunner.release();
    }
  }

  async updateProduct(productId: string, files : Array<Express.Multer.File> , updateProductDto: UpdateProductDto): Promise<{message : string}> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      // initial transaction
      await queryRunner.connect()
      await queryRunner.startTransaction();

      if(!updateProductDto.name && !updateProductDto.description && !updateProductDto.images && !updateProductDto.categoryId && !updateProductDto.attributes) {
        throw new BadRequestException("At least one field must be provided to update the product.")
      }

      // check existing product
      const existingProduct = await this.findOne(productId)
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
      
      // check existing category
      if(updateProductDto.categoryId) {
        const existingCategory = await this.categoryService.findOne(updateProductDto.categoryId);
        if (!existingCategory) {
          throw new NotFoundException('Category not found');
        }
        existingProduct.category = existingCategory
      }
      
      if (updateProductDto.name) {
        existingProduct.name = updateProductDto.name;
      }
      if (updateProductDto.description) {
        existingProduct.description = updateProductDto.description;
      }
      await queryRunner.manager.save(existingProduct);


      // update product attributes
      if(updateProductDto.attributes && updateProductDto.attributes.length > 0) {

        for(const attribute of updateProductDto.attributes) {
          const existingAttribute = await this.attributeService.findOne(attribute.attributeId);
          if (!existingAttribute) {
            throw new NotFoundException('Attribute not found');
          }

          let existingProductAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
            .where('productAttributes.attributesId = :attributesId', {attributesId: attribute.attributeId})
            .andWhere('productAttributes.productsId = :productsId',{productsId : productId})
            .andWhere('productAttributes.deletedAt IS NULL')
            .getOne();
          
          if(!existingProductAttribute) {
            const newProductAttribute = this.productAttributesRepository.create({
              sellPrice: 0,
              buyPrice: 0,
              quantity: 0,
              attributes: existingAttribute,
              products: existingProduct
            });
            await queryRunner.manager.save(newProductAttribute);
          }else {
            existingProductAttribute.attributes = existingAttribute; 
            await queryRunner.manager.save(existingProductAttribute);
          }
            
        }
      }

      // update images
      if(updateProductDto.images && updateProductDto.images.length > 0){
        
        // delete images
        const existingImages = await this.imagesRepository.createQueryBuilder('images')
          .where('images.productsId = :productsId',{productsId : productId})
          .andWhere('images.deletedAt IS NULL')
          .getMany();
        
        const imagesDeleting = existingImages.filter(image => !updateProductDto.images.includes(image.urlImage))

        for(const image of imagesDeleting){
          image.deletedAt = new Date();
          await queryRunner.manager.save(image);
        }
        
        // add new images
        if(files && files.length > 0){
          for(const file of files){
            const uploadedFile = await this.uploadFileCloudinary(file);
            const newImages =  this.imagesRepository.create({
              urlImage: uploadedFile,
              products: existingProduct
            })
            await queryRunner.manager.save(newImages);
          }
        }
       
      }

      // commit transaction
      await queryRunner.commitTransaction();
      return { message: 'Product updated successfully' };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      CommonException.handle(error);
      
    }finally {
      await queryRunner.release();
    }
  }

  async detailProduct(productId: string): Promise<{statistical: {}, product: Products}> {
    try {
      const result = await this.productRepository.createQueryBuilder('products')
        .leftJoinAndSelect('products.productAttributes', 'productAttributes')
        .leftJoinAndSelect('productAttributes.attributes', 'attributes')
        .leftJoinAndSelect('products.category', 'category')
        .leftJoinAndSelect('products.images', 'images')
        .leftJoinAndSelect('products.reviews', 'reviews') 
        .leftJoinAndSelect('products.productDiscount', 'productDiscount')       
        .where('products.id = :productId', { productId })
        .andWhere('products.deletedAt IS NULL')
        .andWhere('attributes.deletedAt IS NULL')
        .andWhere('productAttributes.deletedAt IS NULL')
        .andWhere('category.deletedAt IS NULL')
        .andWhere('images.deletedAt IS NULL')
        .andWhere('productDiscount.deletedAt IS NULL')
        .getOne();
      
      const statisticalReview = await this.productRepository.createQueryBuilder('products')
        .leftJoin('products.reviews', 'reviews')
        .where('products.id = :productId', { productId })
        .addSelect('AVG(reviews.rating) ',' averageRating')
        .addSelect('COUNT(reviews.id) ',' totalReview')
        .addSelect('COUNT(CASE WHEN reviews.rating = 5 THEN 1 END)', 'total5Reviews')
        .addSelect('COUNT(CASE WHEN reviews.rating = 4 THEN 1 END)', 'total4Reviews')
        .addSelect('COUNT(CASE WHEN reviews.rating = 3 THEN 1 END)', 'total3Reviews')
        .addSelect('COUNT(CASE WHEN reviews.rating = 2 THEN 1 END)', 'total2Reviews')
        .addSelect('COUNT(CASE WHEN reviews.rating = 1 THEN 1 END)', 'total1Reviews')
        .andWhere('products.deletedAt IS NULL')
        .getRawOne() as StatisticalReview; 

      
      if(!result) {
        throw new NotFoundException('Product not found');
      }
      
      return {
        statistical: {
         averageRating: statisticalReview.averageRating,
          totalReview: statisticalReview.totalReview,
          total5Reviews: statisticalReview.total5Reviews,
          total4Reviews: statisticalReview.total4Reviews,
          total3Reviews: statisticalReview.total3Reviews,
          total2Reviews: statisticalReview.total2Reviews,
          total1Reviews: statisticalReview.total1Reviews

        },
        product: result
      };
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async checkExistingProductAttribute(productAttributeId: string): Promise<ProductAttributes> {

    try {
      
      const productAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .leftJoinAndSelect('productAttributes.products', 'products')
        .leftJoinAndSelect('products.productDiscount', 'productDiscount')
        .where('productAttributes.id = :id', { id: productAttributeId })
        .andWhere('productAttributes.deletedAt IS NULL')
        .getOne();

      if(!productAttribute) {
        throw new NotFoundException('Product attribute not found');
      }

      if(productAttribute.quantity === 0){
        throw new BadRequestException('Product attribute is out of stock');
      }
      
     
     
      
      return productAttribute;

      
    } catch (error) {
      CommonException.handle(error);
    }
  }
  
  async checkExistingProductAttributeNotQuantity(productAttributeId: string): Promise<ProductAttributes> {

    try {
      
      const productAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .leftJoinAndSelect('productAttributes.products', 'products')
        .leftJoinAndSelect('products.productDiscount', 'productDiscount')
        .where('productAttributes.id = :id', { id: productAttributeId })
        .andWhere('productAttributes.deletedAt IS NULL')
        .getOne();

      if(!productAttribute) {
        throw new NotFoundException('Product attribute not found');
      }
      return productAttribute;

      
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async deleteSoft(id: string): Promise<{message: string}> {
    const queryRunner =  this.dataSource.createQueryRunner()
      try {
        await queryRunner.connect()
        await queryRunner.startTransaction();

        // check product attributes
        const product = await this.productRepository.createQueryBuilder('products')
        .leftJoinAndSelect('products.productAttributes', 'productAttributes')
         .where('products.id = :id', { id })
         .andWhere('products.deletedAt IS NULL')
         .getOne();

        for(let productAttribute of product.productAttributes) {
           // check quantity
          if(productAttribute.quantity > 0) {
            throw new BadRequestException('Cannot deleting product but product attribute is in stock');
          }
          let productAttributeId = productAttribute.id

          // check status bill
          let checkStatusBill = await this.billService.checkBillPendingByProduct(productAttributeId)
          if(checkStatusBill) {
            throw new BadRequestException('Cannot delete product but product attribute is in bill pending or delivery status');
          }

          // check status import receipt
          let checkStatusImport = await this.importReceiptService.statusIsPendingImportReceipt(productAttributeId)
          if(checkStatusImport) {
            throw new BadRequestException('Cannot delete product but product attribute is in import receipt pending status');
          }

          // delete product attribute
          productAttribute.deletedAt = new Date()
          productAttribute.updatedAt = new Date()
          await queryRunner.manager.save(productAttribute)
        }

        product.deletedAt = new Date()
        product.updatedAt = new Date()
        await queryRunner.manager.save(product)

        return {
          message: 'Product deleted successfully'
        }
      } catch (error) {
        CommonException.handle(error);
      }
  }

  async findAll(
    search: string,
    page : number = 1,
    limit : number = 10,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filters: Record<string, any> = {} // Nhận filters từ controller

  ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: Products[]}> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('products')
          .leftJoinAndSelect('products.images', 'images')
          .leftJoinAndSelect('products.productAttributes', 'productAttributes')
          .leftJoinAndSelect('productAttributes.attributes', 'attributes')
          .where('products.deletedAt IS NULL');

          if (search) {
            queryBuilder.andWhere('products.name LIKE :search', { search: `%${search}%` });
          }

           // Filter conditions
            Object.keys(filters).forEach((key) => {
              if (filters[key] !== undefined && filters[key] !== null) {
                let value = filters[key];
                
                // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
                if (value === 'true') value = true;
                if (value === 'false') value = false;

                queryBuilder.andWhere(`products.${key} = :${key}`, { [key]: value });
              }
            });

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`products.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

      return {
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
      }

      return null;
    } catch (error) {
      CommonException.handle(error)
    }
  }


  async uploadFileCloudinary(file : Express.Multer.File): Promise<any>{
    return this.cloudinaryService.uploadFile(file)
  }

}
