import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async detailProduct(productId: string): Promise<Products> {
    try {
      const result = await this.productRepository.createQueryBuilder('products')
        .leftJoinAndSelect('products.productAttributes', 'productAttributes')
        .leftJoinAndSelect('productAttributes.attributes', 'attributes')
        .leftJoinAndSelect('products.category', 'category')
        .leftJoinAndSelect('products.images', 'images')
        .where('products.id = :productId', { productId })
        .andWhere('products.deletedAt IS NULL')
        .andWhere('attributes.deletedAt IS NULL')
        .andWhere('productAttributes.deletedAt IS NULL')
        .andWhere('category.deletedAt IS NULL')
        .andWhere('images.deletedAt IS NULL')
        .getOne();
      
      if(!result) {
        throw new NotFoundException('Product not found');
      }
      
      return result;
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


  async uploadFileCloudinary(file : Express.Multer.File): Promise<any>{
    return this.cloudinaryService.uploadFile(file)
  }

}
