import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bills } from './entities/bill.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { BillDetails } from './entities/bill-detail.entity';
import { CommonException } from 'src/common/exception';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { ProductService } from 'src/product/product.service';
import { PaymentService } from 'src/payment/payment.service';
import { BaseService } from 'src/common/baseService';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class BillService extends BaseService<Bills> {
  constructor(
    @InjectRepository(Bills)
    private readonly billsRepository: Repository<Bills>,
    @InjectRepository(BillDetails)
    private readonly billDetailsRepository: Repository<BillDetails>,
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,

    private readonly voucherService: VoucherService,

    @Inject(forwardRef(() =>ProductService))
    private  productService: ProductService,

    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource
  ){
    super(billsRepository)
  }


  async create(createBillDto: CreateBillDto) : Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      // check accounts
      const account = await this.accountsRepository.createQueryBuilder('accounts')
      .where('accounts.id = :accountId', { accountId: createBillDto.accountId })
      .andWhere('accounts.deletedAt IS NULL')
      .andWhere('accounts.isActive = :isActive', { isActive: true})
      .getOne();
      if (!account) {
        throw new BadRequestException('Account not found or is lock')
      }

      // check payment
      const payment = await this.paymentService.findOne(createBillDto.paymentMethod);
      if(!payment) {
        throw new BadRequestException('Payment method not found')
      }
      

      // check existing product
      const products = await Promise.all(
        createBillDto.products.map(async (product) => {
          const existingProduct = await this.productService.checkExistingProductAttribute(product.productAttributeId)
          
          // check stock
          if(product.quantity > existingProduct.quantity) {
            throw new BadRequestException(`Not enough stock for product `);
          }
            return existingProduct;
          })
      );


      // check voucher
      let voucher = null;
      if(createBillDto.voucher){
          voucher = await this.voucherService.useVouchers(createBillDto.voucher, createBillDto.accountId)
      }

      // calculate total price and discount
      let totalPriceOriginal = 0
      let totalPrice = 0;
      let discount = 0
      let totalDiscountProduct = 0;
      for (const product of products) {
        const productData = createBillDto.products.find(p => p.productAttributeId === product.id);
        const productDiscount = product.products.productDiscount[0]?.id;
        totalPriceOriginal = product.sellPrice * productData.quantity;
        if (productDiscount) {
           discount = product.products.productDiscount[0].value
          totalPrice += product.sellPrice * productData.quantity * (1 - discount / 100);
          totalDiscountProduct += product.sellPrice * productData.quantity * discount / 100;
        } else {
          totalPrice += product.sellPrice * productData.quantity;
        }

        // Update stock in transaction
        product.quantity -= productData.quantity;
        await queryRunner.manager.save(product);
      }
      const voucherValue = voucher? voucher.value : 0
      const finalTotalPrice = totalPrice - voucherValue;


      // create new bill
      const newBill = this.billsRepository.create({
        status: 'pending',
        total: totalPriceOriginal,
        totalDiscount: totalDiscountProduct + voucherValue ? totalDiscountProduct + voucherValue : 0,
        totalPayment: finalTotalPrice > 0 ? finalTotalPrice : 0,
        vouchers: voucher? voucher : null,
        fullName: createBillDto.fullName,
        deliverAddress: createBillDto.deliverAddress,
        deliverPhone: createBillDto.deliverPhone,
        shippingMethod: createBillDto.shippingMethod,
        note: createBillDto.note,
        account: account,
        payments: payment,
      
      });
      await queryRunner.manager.save(newBill);

      // create new bill details
      for(let product of products){
        const newBillDetail = this.billDetailsRepository.create({
          quantity: createBillDto.products.find(item => item.productAttributeId === product.id).quantity,
          price: product.sellPrice,
          discount: product.sellPrice * (discount)/100,
          bills: newBill,
          productAttributes: product
        });
        await queryRunner.manager.save(newBillDetail);

        
        // update cart
        let findProductAttribute = createBillDto.products.find(item => item.productAttributeId === product.id)
        const cart = await this.cartService.getProductByAccountIdAndProductAttributeId(createBillDto.accountId, findProductAttribute.productAttributeId);
        if(cart){

          await queryRunner.manager.remove(cart)
          
        }


      }
      
      await queryRunner.commitTransaction()
      return newBill;

  
    } catch (error) {
      await queryRunner.rollbackTransaction()
      CommonException.handle(error)
    } finally {
      await queryRunner.release()
    }
  }

  async getBillByAccount(
    accountId: string,
    search: string,
    page : number = 1,
    limit : number = 10,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filters: Record<string, any> = {} // Nhận filters từ controller

    ): Promise<{ message: string; total: number;  currentPage: number; totalPage: number; limit : number; data: Bills[]}>
    {

      try {
        const bills =  this.billsRepository.createQueryBuilder('bills')
        .where('bills.accountId = :accountId', {accountId: accountId })
        .andWhere('bills.deletedAt IS NULL');

         if (search) {
            bills.andWhere('entity.name LIKE :search', { search: `%${search}%` });
          }

        // Filter conditions
          Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined && filters[key] !== null) {
              let value = filters[key];
              
              // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
              if (value === 'true') value = true;
              if (value === 'false') value = false;

              bills.andWhere(`bills.${key} = :${key}`, { [key]: value });
            }
          });
        

        // count total
      const total = await bills.getCount();

      // pagination page
      const data = await bills
        .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
        .take(limit) // Giới hạn số bản ghi trả về
        .orderBy(`bills.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
        .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

        

        return {
          message: 'Get bill by account successfully',
          total,
          currentPage: page,
          totalPage,
          limit,
          data: data
        }
      } catch (error) {
        CommonException.handle(error)
      }
  }

  async findOne(id: string): Promise<Bills> {
      try {
        const bill = await this.billsRepository.createQueryBuilder('bills')
        .where('bills.id = :id', { id })
        .andWhere('bills.deletedAt IS NULL')
        .leftJoinAndSelect('bills.payments', 'payments')
        .leftJoinAndSelect('bills.vouchers', 'vouchers')
        .leftJoinAndSelect('bills.account', 'account')
        .leftJoinAndSelect('bills.billDetails', 'billDetails')
        .leftJoinAndSelect('billDetails.productAttributes', 'productAttributes')
        .leftJoinAndSelect('productAttributes.products', 'products')
        .leftJoinAndSelect('productAttributes.attributes', 'attributes')
        .leftJoinAndSelect('products.productDiscount', 'productDiscount')
        .getOne();
        if(!bill){
          throw new BadRequestException('Bill not found')
        }
        return bill;
        
      } catch (error) {
        CommonException.handle(error)
      }
  }

  async updateStatus(billId: string, status: string): Promise<{ message: string }> {
  const queryRunner = this.dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const bill = await this.billsRepository.createQueryBuilder('bills')
      .leftJoinAndSelect('bills.billDetails', 'billDetails')
      .leftJoinAndSelect('billDetails.productAttributes', 'productAttributes')
      .where('bills.id = :id', { id: billId })
      .andWhere('bills.deletedAt IS NULL')
      .getOne();

    if (!bill) {
      throw new BadRequestException('Bill not found');
    }

    // Không cho phép cập nhật nếu đã thanh toán, hủy hoặc thất bại
    if (['success', 'cancelled', 'failed'].includes(bill.status)) {
      throw new BadRequestException(`Hoá đơn đã được ${bill.status}`);
    }

    // Kiểm tra trạng thái hợp lệ
    if (bill.status === 'pending' && status === 'delivery') {
      bill.status = status;
    } else if (bill.status === 'delivery' && status === 'success') {
      bill.status = status;
    } else if ((bill.status === 'pending' || bill.status === 'delivery') && status === 'cancelled') {
      bill.status = status;
      await this.restoreStock(bill, queryRunner); // Khôi phục số lượng hàng tồn nếu hủy
    } else {
      throw new BadRequestException('Chuyển đổi trạng thái không hợp lệ');
    }

    bill.updatedAt = new Date();
    await queryRunner.manager.save(bill);
    await queryRunner.commitTransaction();

    return { message: 'Cập nhật trạng thái đơn hàng thành công.' };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    CommonException.handle(error);
  } finally {
    await queryRunner.release();
  }
}


  async checkBillPendingByProduct(productAttributeId: string): Promise<boolean> {
    try {
      const bill = await this.billsRepository.createQueryBuilder('bills')
       .where('bills.status = :status or bills.status = :status2', { status: 'pending', status2: 'delivery' })
       .andWhere('bills.deletedAt IS NULL')
       .innerJoinAndSelect('bills.billDetails', 'billDetails')
       .innerJoinAndSelect('billDetails.productAttributes', 'productAttributes')
       .where('productAttributes.id = :id', { id: productAttributeId })
       .getMany();
      if(bill.length > 0) {
        return true;
      }else {
        return false;
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }

 

  private async restoreStock(bill: Bills, queryRunner: QueryRunner) {
    for (let detail of bill.billDetails) {
      const productAttribute = await this.productService.checkExistingProductAttributeNotQuantity(detail.productAttributes.id);
      if (productAttribute) {
        productAttribute.quantity += detail.quantity;
        await queryRunner.manager.save(productAttribute);
      }
    }
  }

  
}
