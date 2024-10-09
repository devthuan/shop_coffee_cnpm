import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bills } from './entities/bill.entity';
import { DataSource, Repository } from 'typeorm';
import { BillDetails } from './entities/bill-detail.entity';
import { CommonException } from 'src/common/exception';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bills)
    private readonly billsRepository: Repository<Bills>,
    @InjectRepository(BillDetails)
    private readonly billDetailsRepository: Repository<BillDetails>,
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,

    private readonly dataSource: DataSource
  ){}
  async create(createBillDto: CreateBillDto) : Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      
    //   // check information
    //   if (!createBillDto.products.length) {
    //     throw new Error('Products is required');
    //   }

    //   // check existing product
    //   const products = await Promise.all(
    //     createBillDto.products.map(async (product) => {
    //       const existingProduct = await this.productAttributesRepository.createQueryBuilder()
    //       .where('productAttributes.id = :productAttributesId', {id: product.productAttributeId})
    //       .andWhere('productAttributes.deleteAt is null')
    //       .getOne();
    //       if (!existingProduct) {
    //         throw new Error('Product not found');
    //       }
    //       return existingProduct;
    //     })
    //   );

    //   // check voucher
    //   if(createBillDto.voucher){
    //     const existingVoucher = await this.billsRepository.createQueryBuilder()
    //      .where('bills.voucher = :voucher', {voucher: createBillDto.voucher})
    //      .andWhere('bills.deleteAt is null')
    //      .getOne();
    //     if (existingVoucher) {
    //       throw new Error('Voucher already used');
    //     }
    //   }

    //   // check total price
    //   const totalPrice = products.reduce((sum, product) => {
    //     return sum + product.totalPrice;
    //   }, 0);
    //   if (totalPrice!== createBillDto.totalPrice) {
    //     throw new Error('Total price does not match');
    //   }

    //   // check voucher
    //   if (createBillDto.voucher &&!/^[0-9]{6}$/.test(createBillDto.voucher)) {
    //     throw new Error('Invalid voucher');
    //   }

    //   // check payment method
    //   if

    //   // create new bill
    //   const bill = this.billsRepository.create({
    //     voucher: createBillDto.voucher ? createBillDto.voucher : null,
    //     totalPrice: createBillDto.totalPrice,
    //     status: createBillDto.status,
    //     fullName: createBillDto.fullName,
    //     deliveryAddress: createBillDto.deliveryAddress,
    //     deliveryPhone: createBillDto.deliveryPhone,
    //     shippingMethod: createBillDto.shippingMethod,
    //     paymentMethod: createBillDto.paymentMethod,
    //     note: createBillDto.note,
    //     account: createBillDto.account,
    //     payments: createBillDto.payments,
    //     billDetails: createBillDto.products.map((product) => {
    //       return this.billDetailsRepository.create({
    //         quantity: product.quantity,
    //         price: product.price,
    //         productAttributes: product,
    //       });
    //     }),
    //   });
    //   await queryRunner

    



      
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
