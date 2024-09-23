import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { RespondInterfaceGET, RespondInterfaceGETALL, RespondInterfacePOST } from 'src/common/interface';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Categories } from './entities/category.entity';
import { ProductAttributes } from './entities/product_attributes.entity';
import { ProductDiscount } from './entities/product_discount.entity';
import { Images } from './entities/images.entity';
import { CreateProductAttributeDto } from './dto/create-product_attribute.dto';
import { Attributes } from 'src/attribute/entities/attributes.entity';

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
    private readonly ImagesRepository: Repository<Images>,
  


    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource
  ){}
  
  async create(createProductAttributeDto: CreateProductAttributeDto): Promise<RespondInterfacePOST> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();
    try {
      const newProductAttribute = this.productAttributesRepository.create({
        products: await this.productRepository.findOne({where : {id : createProductAttributeDto.productId}}),
        attributes: await this.attributeRepository.findOne({where : {id : createProductAttributeDto.attributeId}}),
      })

      await queryRunner.manager.save(newProductAttribute);
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        status:'success',
        message: 'Product attribute created successfully',
        data: newProductAttribute
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



  async findOne(productId: string, attributeId: string) : Promise<RespondInterfaceGET> {
    try {
       const queryBuilder = this.productRepository.createQueryBuilder('productAttributes')
        .leftJoinAndSelect('productAttributes.products', 'products')
        .leftJoinAndSelect('productAttributes.attributes', 'attributes')
        .where('products.id = :productId ', { productId: productId })
        .andWhere('productAttributes.id = :attributeId ', { attributeId: attributeId })
        .andWhere('productAttributes.deletedAt IS NULL ')
        .andWhere('products.deletedAt IS NULL ')
        .getOne()
      return {
        statusCode: 200,
        status:'success',
        message: 'Get products attribute successfully',
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

      // Remove attributes with quantity 0 and not in the updated list
      const attributesToRemove = currentAttributes.filter(
        attr => !updatedAttributeNames.includes(attr.attributes.name) && attr.quantity === 0
      );
      for (const attrToRemove of attributesToRemove) {
        attrToRemove.deletedAt = new Date();
        await queryRunner.manager.save(attrToRemove);
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


  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async uploadFileCloudinary(file : Express.Multer.File): Promise<any>{
    return this.cloudinaryService.uploadFile(file)
  }

}
