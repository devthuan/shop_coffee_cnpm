import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { RespondInterfaceGET, RespondInterfaceGETALL, RespondInterfacePOST } from 'src/common/interface';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { ProductAttributeValue } from './entities/product_attribute_values.entity';
import { ProductDiscount } from '../discount/entities/product_discount.entity';
import { Images } from './entities/images.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { AttributeService } from 'src/attribute/attribute.service';
import { SubAttributeService } from 'src/sub-attribute/sub-attribute.service';
import { SubAttributes } from 'src/sub-attribute/entities/sub-attribute.entity';
import { CommonException } from 'src/common/exception';

@Injectable()
export class ProductService {
  
  
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    
    @InjectRepository(SubAttributes)
    private readonly subAttributeRepository: Repository<SubAttributes>,
    
  
    @InjectRepository( ProductAttributeValue)
    private readonly productAttributeValueRepository: Repository<ProductAttributeValue>,
    @InjectRepository(ProductDiscount)
    private readonly productDiscountRepository: Repository<ProductDiscount>,
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,
    

    private readonly categoryService: CategoriesService,
    private readonly attributeService: AttributeService,
    private readonly subAttributeService: SubAttributeService,
    
    private readonly cloudinaryService: CloudinaryService,
    
    private readonly dataSource: DataSource
  ){}
  
  async create(files : Array<Express.Multer.File>, createProductDto: CreateProductDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      // initial transaction
      await queryRunner.connect()
      await queryRunner.startTransaction();

      // check existing product
      if (await this.existingProduct(createProductDto.name)) {
        throw new ConflictException('Product name already exists');
      }

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
      for(const attribute of createProductDto.attributes) {
        const existingAttribute = await this.attributeService.findOne(attribute.attributesId);
        if (!existingAttribute) {
          throw new NotFoundException('Attribute not found');
        }

        for(const item of attribute.subAttribute) {

              if(await this.existingSubAttribute(item.name)){
                throw new ConflictException('Sub Attribute name already exists');
              }

              const newSubAttribute = await this.subAttributeRepository.create({
                name: item.name,
                attributes: existingAttribute
              })
              await queryRunner.manager.save(newSubAttribute);

              const newProductAttributeValue = await this.productAttributeValueRepository.create({
                sellPrice: item.price,
                buyPrice: 0,
                quantity: item.quantity,
                subAttributes: newSubAttribute,
                products: newProduct
              })
              queryRunner.manager.save(newProductAttributeValue);
        }
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


  async existingProduct(name: string): Promise<boolean> {
    const product = await this.productRepository.createQueryBuilder('products')
    .where('products.name = :name', { name })
    .andWhere('products.deletedAt IS NULL')
    .getOne();

    return!!product;

  }

  async existingSubAttribute(name: string): Promise<boolean> {
    const subAttribute = await this.subAttributeRepository.createQueryBuilder('subAttributes')
    .where('subAttributes.name = :name', { name })
    .andWhere('subAttributes.deletedAt IS NULL')
    .getOne();
    return!!subAttribute;
  }

  async uploadFileCloudinary(file : Express.Multer.File): Promise<any>{
    return this.cloudinaryService.uploadFile(file)
  }

}
