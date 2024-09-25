import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { RespondInterfaceGET, RespondInterfaceGETALL, RespondInterfacePOST } from 'src/common/interface';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { ProductAttributes } from './entities/product_attributes.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { Images } from './entities/images.entity';
import { Attributes } from 'src/attribute/entities/attributes.entity';
import { Categories } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductService {
  
  
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(Attributes)
    private readonly attributeRepository: Repository<Attributes>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,
    @InjectRepository(ProductDiscount)
    private readonly productDiscountRepository: Repository<ProductDiscount>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
  


    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource
  ){}
  
  async create(files : Array<Express.Multer.File>, createProductDto: CreateProductDto): Promise<RespondInterfacePOST> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();
    try {
      // init product
      const newProduct = this.productRepository.create({
        name: createProductDto.name,
        sellPrice: +createProductDto.price,
        buyPrice: 0,
        description: createProductDto.description,
        category: await this.categoriesRepository.findOneOrFail({where: { name: createProductDto.category }}),
      })
      const result = await queryRunner.manager.save(newProduct);

        // Init product attributes
      const attributePromises = createProductDto.attributes.map(async (item) => {
        const attribute = await this.attributeRepository.findOneOrFail({ where: { name: item.value } });
        const productAttribute = this.productAttributesRepository.create({
          products: newProduct,
          attributes: attribute,
        });
        return queryRunner.manager.save(productAttribute);
      });

        // Khởi tạo hình ảnh sản phẩm
      // const imagePromises = files && files.length > 0 ? files.map(async (file) => {
      //   const { secure_url } = await this.uploadFileCloudinary(file);
      //   const productImages = this.imagesRepository.create({
      //     urlImage: secure_url,
      //     products: newProduct,
      //   });
      //   return queryRunner.manager.save(productImages);
      // }) : []; // Đảm bảo imagePromises là một mảng


        // Khởi tạo hình ảnh sản phẩm (test)
      
        const  secure_url  = "https://res.cloudinary.com/dsho2mecb/image/upload/v1726934274/md2srnm8lhel4kmijm9p.png"
        const productImages = this.imagesRepository.create({
          urlImage: secure_url,
          products: newProduct,
        });
       queryRunner.manager.save(productImages);
    

      // Execute all promises concurrently
      await Promise.all([...attributePromises]);

     
      await queryRunner.commitTransaction();
      
      return {
        statusCode: 201,
        status:'success',
        message: 'Product created successfully',
        data: result
      }
        
    
    } catch (error) {
      queryRunner.rollbackTransaction();
      console.log(error)
      return {
        statusCode: 500,
        status: 'error',
        message: 'Error creating product',
        data: null
      }
    }finally{
      await queryRunner.release();
    }
  }


  async findAll(
    
      search : string,
      page : number,
      limit : number,
      sortBy : string,
      sortOrder : string
  ) : Promise<RespondInterfaceGETALL> {
    try {
      const queryBuilder = this.productRepository.createQueryBuilder('products')
        .leftJoinAndSelect('products.category', 'categories')
        .leftJoinAndSelect('products.productAttributes', 'productAttributes')
        .leftJoinAndSelect('productAttributes.attributes', 'attributes')
        .leftJoinAndSelect('products.images', 'images')
        .select([
          'products.id',              // Select fields from products
          'products.name',
          'products.sellPrice',
          'products.buyPrice',
          'products.description',
          'images.urlImage',
          'products.createdAt',        // Include createdAt for sorting
          'categories.id',             // Select fields from categories
          'categories.name',
          'productAttributes.id',      // Select fields from productAttributes
          'productAttributes.quantity',
          'attributes.id',             // Select fields from attributes
          'attributes.name'
      ]);

      // Handle search condition properly
      if (search) {
        queryBuilder.where('products.name LIKE :search AND products.deletedAt IS NULL', { search: `%${search}%` });
      } else {
        queryBuilder.where('products.deletedAt IS NULL');
      }

      if (sortBy) {
        queryBuilder.orderBy(`products.${sortBy}`, sortOrder as 'ASC' | 'DESC');
      }

      const [result, total] = await queryBuilder
        .where('productAttributes.deletedAt IS NULL')
        .andWhere('images.deletedAt IS NULL')
        .andWhere('categories.deletedAt IS  NULL')
        .andWhere('products.deletedAt IS NULL')
        .andWhere('attributes.deletedAt IS  NULL')  
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      return {
        statusCode: 200,
        status:'success',
        message: 'Products retrieved successfully',
        total,
        totalPages,
        currentPage: +page,
        data: result
      }


    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        status: 'error',
        message: 'Error retrieving products',
        total: 0,
        totalPages: 0,
        currentPage: 0,
        data: null
      }
    }
  }

  async findOne(id: string) : Promise<RespondInterfaceGET> {
    try {
       const queryBuilder = this.productRepository.createQueryBuilder('products')
        .innerJoinAndSelect('products.category', 'categories')
        .innerJoinAndSelect('products.productAttributes', 'productAttributes')
        .innerJoinAndSelect('productAttributes.attributes', 'attributes')
        .innerJoinAndSelect('products.images', 'images')
        .leftJoinAndSelect('products.reviews', 'reviews')
        .leftJoinAndSelect('reviews.accounts', 'accounts') //
        
        .select([
          'products.id',              
          'products.name',
          'products.sellPrice',
          'products.buyPrice',
          'products.description',
          'products.createdAt',        
          'images.urlImage',
          'categories.id',             
          'categories.name',
          'productAttributes.id',      
          'productAttributes.quantity',
          'attributes.id',             
          'attributes.name',
          'reviews.id',
          'reviews.rating',
          'reviews.comment',
          'reviews.createdAt',
          'accounts.id', 
          'accounts.email',

      ])
        .where('products.id = :id AND products.deletedAt IS NULL', { id: id })
        .andWhere('productAttributes.deletedAt IS NULL ')
        .andWhere('categories.deletedAt IS NULL ')
        .andWhere('images.deletedAt IS NULL ')
        .andWhere('accounts.deletedAt IS NULL ')
        .andWhere('reviews.deletedAt IS NULL ')
        .andWhere('attributes.deletedAt IS NULL ')
        .getOne()
      return {
        statusCode: 200,
        status:'success',
        message: 'Products retrieved successfully',
        data: await queryBuilder
      }
      

    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        status: 'error',
        message: 'Error retrieving product',
        data: null
      }
    }
  }

  async update(id: string, files: Array<Express.Multer.File>, updateProductDto: UpdateProductDto): Promise<RespondInterfaceGET> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Fetch and update product details
    const product = await this.productRepository.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new Error('Product not found');

    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.description) product.description = updateProductDto.description;

    if (updateProductDto.category) {
      const category = await this.categoriesRepository.findOneOrFail({ where: { name: updateProductDto.category } });
      product.category = category;
    }

    await queryRunner.manager.save(product);

    // Fetch current attributes for the product
    const currentAttributes = await this.productAttributesRepository
      .createQueryBuilder('productAttributes')
      .leftJoinAndSelect('productAttributes.attributes', 'attributes')
      .where('productAttributes.productsId = :id', { id: product.id })
      .andWhere('productAttributes.deletedAt IS NULL')
      .getMany();

    // Update product attributes
    if (updateProductDto.attributes) {
      const updatedAttributeNames = updateProductDto.attributes.map(attr => attr.value);

       // List to track attributes that could not be deleted
      const undeletedAttributes = [];


      // Remove attributes with quantity 0 and not in the updated list
      const attributesToRemove = currentAttributes.filter(
        attr => !updatedAttributeNames.includes(attr.attributes.name) 
      );
      for (const attrToRemove of attributesToRemove) {
        if(attrToRemove.quantity > 0) {
          undeletedAttributes.push(attrToRemove.attributes.name);
        }else {
          attrToRemove.deletedAt = new Date();
          await queryRunner.manager.save(attrToRemove);

        }
      }

      // Add or update attributes
      const attributePromises = updateProductDto.attributes.map(async item => {
        const attribute = await this.attributeRepository.findOneOrFail({ where: { name: item.value } });

        const productAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
          .where('productAttributes.productsId = :productId', { productId: product.id })
          .andWhere('productAttributes.attributesId = :attributeId', { attributeId: attribute.id })
          .andWhere('productAttributes.deletedAt IS NULL')
          .getOne();

        if (!productAttribute) {
          const newProductAttribute = this.productAttributesRepository.create({
            products: product,
            attributes: attribute
          });
          await queryRunner.manager.save(newProductAttribute);
        }
      });

      await Promise.all(attributePromises);

      if (undeletedAttributes.length > 0) {
        return {
          statusCode: 400,
          status: 'warning',
          message: `The following attributes could not be deleted because their quantity is greater than 0: ${undeletedAttributes.join(', ')}`,
          data: null
        };
      }

    }

    // update product images
    if (files && files.length > 0) {
      const currentImage = await this.imagesRepository.createQueryBuilder('images')
        .leftJoinAndSelect('images.products', 'products')
        .where('products.id = :productsId', { productsId: product.id })
        .andWhere('images.deletedAt IS NULL')
        .getMany()

        // Remove images that are not in the updated list
      for (const imgToRemove of currentImage) {
        await queryRunner.manager.remove(imgToRemove);
      }

      const cloudinaryImages = await Promise.all(
        files.map(async file => {
          const { secure_url } = await this.uploadFileCloudinary(file);
          return this.imagesRepository.create({
            urlImage: secure_url,
            products: product
          });
        })
      );
      await queryRunner.manager.save(cloudinaryImages);
    }

    await queryRunner.commitTransaction();
    return {
      statusCode: 200,
      status: 'success',
      message: 'Product updated successfully',
      data: null,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return {
      statusCode: 500,
      status: 'error',
      message: 'Error updating product',
      data: null,
    };
  } finally {
    await queryRunner.release();
  }
}


  async deleteSoft(id: string) : Promise<RespondInterfaceGET> {
    try {
      const product = await this.productRepository.findOne({ where: { id, deletedAt: null } });
      if (!product) throw new Error('Product not found');
      
      product.deletedAt = new Date();
      await this.productRepository.save(product);
      
      return {
        statusCode: 200,
        status:'success',
        message: 'Product deleted successfully',
        data: null,
      };
      
    } catch (error) {
        return {
          statusCode: 500,
          status: 'error',
          message: 'Error deleting product',
          data: null,
        }
    }
  }

  async uploadFileCloudinary(file : Express.Multer.File): Promise<any>{
    return this.cloudinaryService.uploadFile(file)
  }

}
