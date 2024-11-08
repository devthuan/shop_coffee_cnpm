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
      { column: 'website', value: createSupplierDto.website },
      { column: 'bankAccountNumber', value: createSupplierDto.bankAccountNumber }
    ];

    for (const { column, value } of columnsToCheck) {
      if (value && (await this.checkExistingCommon({ column, value }))) {
        throw new BadRequestException(`Supplier ${column} already exists`);
      }
    }


      const newSupplier = await this.create(createSupplierDto);
      await queryRunner.manager.save(newSupplier);

      for(let detailSupplier of createSupplierDto.detailSuppliers) {
          detailSupplier.supplierId = newSupplier.id
         await this.createDetailSupplier(detailSupplier, queryRunner);

      }

      await queryRunner.commitTransaction();

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
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC',
      filters: Record<string, any> = {} // Nhận filters từ controller
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: Supplier[]}> 
    { 
    try {
        const queryBuilder = this.supplierRepository.createQueryBuilder('supplier')
          .leftJoinAndSelect('supplier.detailSupplier', 'detailSupplier')
          .where('supplier.deletedAt IS NULL')

          if (search) {
            queryBuilder.andWhere('supplier.name LIKE :search', { search: `%${search}%` });
          }

           // Filter conditions
            Object.keys(filters).forEach((key) => {
              if (filters[key] !== undefined && filters[key] !== null) {
                let value = filters[key];
                
                // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
                if (value === 'true') value = true;
                if (value === 'false') value = false;

                queryBuilder.andWhere(`supplier.${key} = :${key}`, { [key]: value });
              }
            });

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`supplier.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

      return {
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async getDetailSupplier(supplierId: string): Promise<Supplier[]>{
    try {
      const supplier = await this.supplierRepository
        .createQueryBuilder('supplier')
        .leftJoinAndSelect('supplier.detailSupplier', 'detailSupplier', 
          `detailSupplier.version = (
            SELECT MAX(ds.version)
            FROM detailSupplier ds
            WHERE ds.productAttributeId = detailSupplier.productAttributeId
            AND ds.deletedAt IS NULL
          )`
        )
        .leftJoinAndSelect('detailSupplier.productAttribute', 'productAttribute')
        .leftJoinAndSelect('productAttribute.attributes', 'attributes')
        .leftJoinAndSelect('productAttribute.products', 'products')
        .where('supplier.id = :supplierId', { supplierId })
        .andWhere('supplier.deletedAt IS NULL')
        .andWhere('detailSupplier.deletedAt IS NULL')
        .getMany();


        if (!supplier) {
          throw new BadRequestException('Supplier not found');
        }
      
        return supplier;
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async updateSupplier(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    try {
      const supplier = await this.findOne(id);
      if (!supplier) {
        throw new BadRequestException('Supplier not found');
      }

      // check duplicates
    const columnsToCheck = [
      { column: 'name', value: updateSupplierDto.name },
      { column: 'email', value: updateSupplierDto.email },
      { column: 'phone', value: updateSupplierDto.phone },
      { column: 'website', value: updateSupplierDto.website },
      { column: 'bankAccountNumber', value: updateSupplierDto.bankAccountNumber }
    ];

    for (const { column, value } of columnsToCheck) {
      if (value && (await this.checkExistingCommon({ column, value, id }))) {
        throw new BadRequestException(`Supplier ${column} already exists`);
      }
    }
    
      Object.assign(supplier, updateSupplierDto);
      await this.update(id, supplier);


      return supplier;
    } catch (error) {
      CommonException.handle(error)
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
          supplier,
          productAttribute,
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
