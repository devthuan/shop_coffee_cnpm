import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateImportReceiptDto } from './dto/create-import_receipt.dto';
import { StatusImportReceiptDto, UpdateImportReceiptDto } from './dto/update-import_receipt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImportReceipts } from './entities/import_receipt.entity';
import { DataSource, Repository } from 'typeorm';
import { ImportReceiptDetail } from './entities/import_receipt_detail.entity';
import { BaseService } from 'src/common/baseService';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { SupplierService } from 'src/supplier/supplier.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ImportReceiptService extends BaseService<ImportReceipts> {

  constructor(
    @InjectRepository(ImportReceipts)
    private readonly importReceiptsRepository: Repository<ImportReceipts>,  

    @InjectRepository(ImportReceiptDetail)
    private readonly ImportReceiptDetailRepository: Repository<ImportReceiptDetail>,  
    
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,  

    @Inject(forwardRef(() =>SupplierService))
    private  supplierService : SupplierService,

    @Inject(forwardRef(() =>ProductService))
    private  productService : ProductService,

    private readonly dataSource : DataSource
  ){
    super(importReceiptsRepository);
  }

  async create(createImportReceiptDto: CreateImportReceiptDto) : Promise<ImportReceipts> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
       .where('accounts.id = :accountId', { accountId: createImportReceiptDto.accountId })
       .andWhere('accounts.deletedAt IS NULL')
       .andWhere('accounts.isActive = :isActive', { isActive: true})
       .getOne();
      
      if(!account){
        throw new BadRequestException('Account not found or is lock');
      }

      // check supplier
      const supplier = await this.supplierService.findOne(createImportReceiptDto.supplierId);
      if(!supplier){
        throw new BadRequestException('Supplier not found');
      }

      // check list productAttributes
      let totalAmount = 0;

      if(createImportReceiptDto.importReceiptDetails.length > 0){
        for(const detail of createImportReceiptDto.importReceiptDetails) {
          const checkProductAttribute = await this.productService.checkExistingProductAttributeNotQuantity(detail.productAttributeId);
          if(!checkProductAttribute){
            throw new BadRequestException('Product attribute not found');
          }
          totalAmount += detail.price * detail.quantity;

        }
          
      }

      const newImportReceipt =  this.importReceiptsRepository.create({
        totalAmount,
        note: createImportReceiptDto.note ,
        status: 'pending',
        supplier,
        account
      })
      await queryRunner.manager.save(newImportReceipt);

      for(const detail of createImportReceiptDto.importReceiptDetails) {
        const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(detail.productAttributeId);
        const newImportReceiptDetail =  this.ImportReceiptDetailRepository.create({
          productAttribute: productAttribute,
          unitPrice: detail.price,
          quantity: detail.quantity,
          totalPrice: detail.price * detail.quantity,
          importReceipt: newImportReceipt
        })
        await queryRunner.manager.save(newImportReceiptDetail);
      }

      await queryRunner.commitTransaction();
      return newImportReceipt;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      CommonException.handle(error);
    }finally{
      await queryRunner.release();
    }
  }

  async findAll(
      search: string,
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC',
      filters: Record<string, any> = {} // Nhận filters từ controller
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: ImportReceipts[]}> 
    { 
    try {
        const queryBuilder = this.importReceiptsRepository.createQueryBuilder('importReceipts')
        .leftJoinAndSelect('importReceipts.account', 'account')
        .leftJoinAndSelect('account.userInformation', 'userInformation')
        .leftJoinAndSelect('importReceipts.supplier','supplier')
        .where('importReceipts.deletedAt IS NULL')

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

                queryBuilder.andWhere(`importReceipts.${key} = :${key}`, { [key]: value });
              }
            });

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`importReceipts.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
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

  async detailImportReceipt(importReceiptId: string): Promise<ImportReceipts> {
    try {
      const importReceipt = await this.importReceiptsRepository.createQueryBuilder('importReceipts')
        .leftJoinAndSelect('importReceipts.importReceiptDetail', 'importReceiptDetail')
        .leftJoinAndSelect('importReceiptDetail.productAttribute', 'productAttribute')
        .leftJoinAndSelect('productAttribute.products', 'products')
        .leftJoinAndSelect('productAttribute.attributes', 'attributes')
        .where('importReceipts.deletedAt is null')
        .andWhere('importReceipts.id = :id',{id :importReceiptId})
        .getOne();

        if(!importReceipt){
          throw new BadRequestException('Import receipt not found');
        }
        return importReceipt;

      } catch (error) {
      CommonException.handle(error);
    }
  }

  async updateStatusBill(importReceiptId: string, statusImportReceiptDto: StatusImportReceiptDto): Promise<{message: string}> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      // check account
      const accountCheck = await this.accountsRepository.createQueryBuilder('accounts')
       .where('accounts.id = :accountId', { accountId: statusImportReceiptDto.accountId })
       .andWhere('accounts.deletedAt IS NULL')
       .andWhere('accounts.isActive = :isActive', { isActive: true})
       .getOne();
      
      if(!accountCheck){
        throw new BadRequestException('Account not found or is lock');
      }
      
      // check import receipt
      const importReceipt = await this.importReceiptsRepository.createQueryBuilder('importReceipts')
      .leftJoinAndSelect('importReceipts.importReceiptDetail', 'importReceiptDetail')
      .leftJoinAndSelect('importReceiptDetail.productAttribute', 'productAttribute')
      .where('importReceipts.id = :importReceiptId', { importReceiptId })
      .andWhere('importReceipts.deletedAt IS NULL')
      .getOne();

    
      if(!importReceipt){
        throw new BadRequestException('Import receipt not found');
      }

      if(statusImportReceiptDto.status === "rejected" && importReceipt.status === "pending"){
        importReceipt.status = statusImportReceiptDto.status
        importReceipt.updatedAt = new Date();
      }else if( importReceipt.status === "rejected"){
        throw new BadRequestException('Import receipt has been rejected');
      }
      else if( importReceipt.status === "approved"){
        throw new BadRequestException('Import receipt has been approved');
      }
      
      else if(statusImportReceiptDto.status === "approved" && importReceipt.status === "pending"){
        importReceipt.status = statusImportReceiptDto.status
        importReceipt.updatedAt = new Date();

        for(let detail of importReceipt.importReceiptDetail){
          console.log(detail)
          const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(detail.productAttribute?.id);
          // update quantity and price product attributes
          let averagePrice = (productAttribute.sellPrice * productAttribute.quantity + detail.unitPrice * detail.quantity) / (productAttribute.quantity + detail.quantity);
          let priceSellFinal = averagePrice * 1.4
          productAttribute.quantity += detail.quantity;
          productAttribute.sellPrice = priceSellFinal;
          productAttribute.buyPrice = detail.unitPrice
          await queryRunner.manager.save(productAttribute);
        }
      }

      await queryRunner.manager.save(importReceipt);

      await queryRunner.commitTransaction();
      
      return {
        message: `Update status import receipt success. your import receipt has been ${statusImportReceiptDto.status}`
      };
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async statusIsPendingImportReceipt(productAttributeId: string) : Promise<boolean> {
    try {
      const importReceipt = await this.importReceiptsRepository.createQueryBuilder('importReceipts')
        .leftJoinAndSelect('importReceipts.importReceiptDetail', 'importReceiptDetail')
       .where('importReceiptDetail.productAttributeId = :productAttributeId', { productAttributeId })
       .andWhere('importReceipts.deletedAt IS NULL')
       .andWhere('importReceipts.status = :status', { status: 'pending' })
       .getMany();
       
      
      if(!importReceipt){
        return false;
      }
      return true;
      
    } catch (error) {
      CommonException.handle(error);
    }
  }


  
  
}
