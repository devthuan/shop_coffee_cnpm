import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateDetailSupplier, CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { BaseService } from 'src/common/baseService';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { DetailSupplier } from './entities/detail-supplier.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SupplierService extends BaseService<Supplier> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(DetailSupplier)
    private readonly detailSupplierRepository: Repository<DetailSupplier>,

    @Inject(forwardRef(() =>ProductService))
    private readonly productService: ProductService ,
    private readonly dataSource: DataSource
  ){
    super(supplierRepository)
  }


  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // check duplicates
      const columnsToCheck = [
      { column: 'name', value: createSupplierDto.name },
      { column: 'email', value: createSupplierDto.email },
      { column: 'phone', value: createSupplierDto.phone },
    ];

    for (const { column, value } of columnsToCheck) {
      if (value && (await this.checkExistingCommon({ column, value }))) {
        throw new BadRequestException(`Supplier ${column} already exists`);
      }
    }


      const newSupplier = await this.create(createSupplierDto);
      await queryRunner.manager.save(newSupplier);

      let dataDetailSupplier =[]
      for(let detailSupplier of createSupplierDto.detailSuppliers) {
          detailSupplier.supplierId = newSupplier.id
         dataDetailSupplier.push(await this.createDetailSupplier(detailSupplier, queryRunner))

      }

      await queryRunner.commitTransaction();
      
      let dataFormat = dataDetailSupplier.map(item => ({
        id:item.id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        price: item.price,
        version: item.version
      }))

      newSupplier['detailSupplier'] = dataFormat as any

      return newSupplier;
    } catch (error) {
      await queryRunner.rollbackTransaction()
      CommonException.handle(error)
    }finally {
      await queryRunner.release();
    }
  }

  async createDetailSupplier(createDetailSupplier: CreateDetailSupplier, queryRunner: QueryRunner): Promise<DetailSupplier> {
  try {
   

    // Check product attribute
    const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(createDetailSupplier.productAttributeId);
    if (!productAttribute) {
      throw new BadRequestException('Product attribute not found');
    }

    // Check if the detail supplier already exists
    const existingDetailSupplier = await this.detailSupplierRepository.createQueryBuilder('detailSupplier')
      .leftJoinAndSelect('detailSupplier.supplier', 'supplier')
      .leftJoinAndSelect('detailSupplier.productAttribute', 'productAttribute')
      .where('detailSupplier.supplierId = :supplierId', { supplierId: createDetailSupplier.supplierId })
      .andWhere('detailSupplier.productAttributeId = :productAttributeId', { productAttributeId: createDetailSupplier.productAttributeId })
      .andWhere('detailSupplier.deletedAt IS NULL')
      .orderBy('detailSupplier.version', 'DESC')
      .getOne();

    if (existingDetailSupplier) {
      // If the price is the same, throw an error
      if (existingDetailSupplier.price === createDetailSupplier.price) {
        throw new BadRequestException('Product attribute with this price already exists');
      } else {
        // Create new version if price is different
        const newDetailSupplier = this.detailSupplierRepository.create({
          price: createDetailSupplier.price,
          version: existingDetailSupplier.version + 1,
          supplier: {id: createDetailSupplier.supplierId},
          productAttribute,
        });
        await queryRunner.manager.save(newDetailSupplier);

        return newDetailSupplier; // Return the newly created detail supplier with updated price
      }
    } else {
      // Create new detail supplier if it doesn't exist
      const newDetailSupplier = this.detailSupplierRepository.create({
        price: createDetailSupplier.price,
        version: 1,
        supplier: {id: createDetailSupplier.supplierId},
        productAttribute,
      });

      await queryRunner.manager.save(newDetailSupplier);

      return newDetailSupplier; // Return the newly created detail supplier
    }

  } catch (error) {
    throw error; // No need to rollback here, `createSupplier` will handle it
  }
  }

  async findAll(
  search: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  filters: Record<string, any> = {}
): Promise<{ total: number; currentPage: number; totalPage: number; limit: number; data: Supplier[] }> {
  try {
    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.detailSupplier', 'detailSupplier')
      .leftJoinAndSelect('detailSupplier.productAttribute', 'productAttribute')
      .leftJoinAndSelect('productAttribute.products', 'products')
      .leftJoinAndSelect('productAttribute.attributes', 'attributes')
      .where('supplier.deletedAt IS NULL')
      .andWhere('detailSupplier.deletedAt IS NULL');
  

    // Search condition
    if (search) {
      queryBuilder.andWhere('supplier.name LIKE :search', { search: `%${search}%` });
    }

    // Valid fields for filters (replace with actual fields of the `supplier` table)
    const validFields = ['name', 'status', 'location']; // Add other fields as needed

    // Filter conditions
    Object.keys(filters).forEach((key) => {
      if (validFields.includes(key) && filters[key] !== undefined && filters[key] !== null) {
        let value = filters[key];

        // Convert string boolean values to actual booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;

        queryBuilder.andWhere(`supplier.${key} = :${key}`, { [key]: value });
      }
    });

    // Count total records
    const total = await queryBuilder.getCount();

    // Pagination, sorting, and fetching data
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`supplier.${sortBy}`, sortOrder)
      .getMany();

    const totalPage = Math.ceil(total / limit);

    return {
      total,
      totalPage,
      currentPage: page,
      limit,
      data
    };
  } catch (error) {
    CommonException.handle(error);
    throw new Error('Failed to fetch suppliers');
  }
}


  async getDetailSupplier(supplierId: string): Promise<Supplier>{
    try {
       const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.detailSupplier', 'detailSupplier')
      .leftJoinAndSelect('detailSupplier.productAttribute', 'productAttribute')
      .leftJoinAndSelect('productAttribute.attributes', 'attributes')
      .leftJoinAndSelect('productAttribute.products', 'products')
      .where('supplier.id = :supplierId', { supplierId })
      .andWhere('supplier.deletedAt IS NULL')
      .andWhere('detailSupplier.deletedAt IS NULL')
      
      .getOne();


        if (!supplier) {
          throw new BadRequestException('Supplier not found');
        }
      
        return supplier;
    } catch (error) {
      CommonException.handle(error)
    }
  }

 async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
  const queryRunner = this.dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    // Fetch the supplier along with its related detailSuppliers
    const supplier = await this.getDetailSupplier(id);
    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    // Check for duplicate values if any of the fields have changed
    if (updateSupplierDto.name !== supplier.name && updateSupplierDto.email !== supplier.email && updateSupplierDto.phone !== supplier.phone) {
      const columnsToCheck = [
        { column: 'name', value: updateSupplierDto.name },
        { column: 'email', value: updateSupplierDto.email },
        { column: 'phone', value: updateSupplierDto.phone },
      ];

      for (const { column, value } of columnsToCheck) {
        if (value && (await this.checkExistingCommon({ column, value, id }))) {
          throw new BadRequestException(`Supplier ${column} already exists`);
        }
      }
    }

    // Update or create detailSuppliers
    if (updateSupplierDto.detailSuppliers) {
      for (let updateDetail of updateSupplierDto.detailSuppliers) {
        const detailSupplier = supplier.detailSupplier.find(
          (detail) => detail.productAttribute.id === updateDetail.productAttributeId
        );

        if (detailSupplier) {
          // Update existing detailSupplier
          detailSupplier.price = updateDetail.price;
          detailSupplier.updatedAt = new Date();

          await queryRunner.manager.save(detailSupplier);
        } else {
          // Create a new detailSupplier if it doesn't exist
          const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(updateDetail.productAttributeId);

          if (!productAttribute) {
            throw new BadRequestException('Product Attribute not found');
          }

          // Create a new detailSupplier and set the supplier field correctly
          const newDetail = this.detailSupplierRepository.create({
            price: updateDetail.price,
            version: 1,
            supplier: supplier, // Ensure supplier is assigned correctly
            productAttribute: productAttribute, // Ensure productAttribute is assigned correctly
          });
          
          await this.detailSupplierRepository.save(newDetail)
          // Save the new detailSupplier
          // await queryRunner.manager.save(newDetail);
        }
      }
    }

    // Update the supplier data
    supplier.updatedAt = new Date();
   
    Object.assign(supplier, updateSupplierDto);
    await queryRunner.manager.save(supplier);

    // Commit the transaction
    await queryRunner.commitTransaction();



    return supplier;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    CommonException.handle(error);
  } finally {
    await queryRunner.release();
  }
}






  async addDetailSupplier(createDetailSupplier: CreateDetailSupplier): Promise<DetailSupplier> {
  const queryRunner = this.dataSource.createQueryRunner();
  
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Check supplier
    const supplier = await this.findOne(createDetailSupplier.supplierId);
    if (!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    // Check product attribute
    const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(createDetailSupplier.productAttributeId);
    if (!productAttribute) {
      throw new BadRequestException('Product attribute not found');
    }

    // Check if the detail supplier already exists
    const existingDetailSupplier = await this.detailSupplierRepository.createQueryBuilder('detailSupplier')
      .leftJoinAndSelect('detailSupplier.supplier', 'supplier')
      .leftJoinAndSelect('detailSupplier.productAttribute', 'productAttribute')
      .where('detailSupplier.supplierId = :supplierId', { supplierId: createDetailSupplier.supplierId })
      .andWhere('detailSupplier.productAttributeId = :productAttributeId', { productAttributeId: createDetailSupplier.productAttributeId })
      .andWhere('detailSupplier.deletedAt IS NULL')
      .orderBy('detailSupplier.version', 'DESC')
      .getOne();

    if (existingDetailSupplier) {
      if (existingDetailSupplier.price === createDetailSupplier.price) {
        throw new BadRequestException('Product attribute with this price already exists');
      } else {
        const newDetailSupplier = this.detailSupplierRepository.create({
          price: createDetailSupplier.price,
          version: existingDetailSupplier.version + 1,
          supplier: supplier,
          productAttribute: productAttribute,
        });
      await queryRunner.manager.save(newDetailSupplier); 

        await queryRunner.commitTransaction();  

        return existingDetailSupplier;  
      }
    } else {
      const newDetailSupplier = this.detailSupplierRepository.create({
        price: createDetailSupplier.price,
        version: 1,
        supplier,
        productAttribute,
      });

      await queryRunner.manager.save(newDetailSupplier);
      await queryRunner.commitTransaction();  // Commit after creating a new supplier

      return newDetailSupplier;
    }

  } catch (error) {
    await queryRunner.rollbackTransaction();
    CommonException.handle(error);  // Handle the exception properly
  } finally {
    await queryRunner.release();
  }
  }

  async deleteSoftDetailSupplier(detailSupplierId: string): Promise<{message: string}> {
    try {
      const detailSupplier = await this.detailSupplierRepository.createQueryBuilder('detailSupplier')
        .where('detailSupplier.id = :detailSupplierId', { detailSupplierId })
        .andWhere('detailSupplier.deletedAt IS NULL')
        .getOne();

      if (!detailSupplier) {
        throw new BadRequestException('Detail supplier not found');
      }
      
      detailSupplier.deletedAt = new Date();
      await this.detailSupplierRepository.save(detailSupplier)

      return {
        message: "remove detail supplier successfully"
      }
    } catch (error) {
      CommonException.handle(error); 
    }
  }

}
