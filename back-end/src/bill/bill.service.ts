import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
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

@Injectable()
export class BillService {
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
  ){}


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

  findAll() {
    return `This action returns all bill`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }

  update(id: number, updateBillDto: UpdateBillDto) {
    return `This action updates a #${id} bill`;
  }

  remove(id: number) {
    return `This action removes a #${id} bill`;
  }
}
