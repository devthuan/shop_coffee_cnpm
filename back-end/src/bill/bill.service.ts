import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bills } from './entities/bill.entity';
import { DataSource, Repository } from 'typeorm';
import { BillDetails } from './entities/bill-detail.entity';
import { CommonException } from 'src/common/exception';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { ProductService } from 'src/product/product.service';
import { PaymentService } from 'src/payment/payment.service';
import { BaseService } from 'src/common/baseService';

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
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
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
        const productDiscount = product.products.productDiscount[0].id;
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
      }
      
      await queryRunner.commitTransaction()
      return newBill;

  
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async findOne(id: string): Promise<Bills> {
      try {
        const bill = await this.billsRepository.createQueryBuilder('bills')
        .where('bills.id = :id', { id })
        .andWhere('bills.deletedAt IS NULL')
        .innerJoinAndSelect('bills.payments', 'payments')
        .innerJoinAndSelect('bills.vouchers', 'vouchers')
        .innerJoinAndSelect('bills.account', 'account')
        .innerJoinAndSelect('bills.billDetails', 'billDetails')
        .innerJoinAndSelect('billDetails.productAttributes', 'productAttributes')
        .innerJoinAndSelect('productAttributes.products', 'products')
        .innerJoinAndSelect('productAttributes.attributes', 'attributes')
        .innerJoinAndSelect('products.productDiscount', 'productDiscount')
        .getOne();
        if(!bill){
          throw new BadRequestException('Bill not found')
        }
        return bill;
        
      } catch (error) {
        CommonException.handle(error)
      }
  }

  async updateStatus(billId: string, status: string): Promise<{message: string}>{
    try {
      const bill = await this.billsRepository.createQueryBuilder('bills')
        .where('bills.id = :id', { id: billId })
        .andWhere('bills.deletedAt IS NULL')
        .getOne();

        if(!bill){
          throw new BadRequestException('Bill not found')
        }

        // ['pending', 'delivery', 'success', 'failed', 'cancelled']

        if (bill.status === 'success') {
            throw new BadRequestException('Bill has been paid');
        } else if (bill.status === 'cancelled') {
            throw new BadRequestException('Bill has been cancelled');
        } else if (bill.status === 'failed') {
          throw new BadRequestException('Bill has been failed');
        } 
        else if (bill.status === 'pending' && status === 'cancelled' || status === 'delivery') {
          bill.status = status
        } 
        else if (bill.status === 'delivery' && status === 'failed' || status === 'success') { 
          bill.status = status
        }else {
          throw new BadRequestException('Invalid status for this bill');
        }

        await this.billsRepository.save(bill);
        return { message: 'Bill status updated successfully' }
        
    } catch (error) {
      CommonException.handle(error)
    }
  }

  
}
