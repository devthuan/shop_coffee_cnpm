import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BaseService } from 'src/common/baseService';
import { Vouchers } from './entities/vouchers.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonException } from 'src/common/exception';
import { UseVouchers } from './entities/use-voucher.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { UseVoucherDto } from './dto/use-voucher-dto';

@Injectable()
export class VoucherService extends BaseService<Vouchers> {
  constructor(
    @InjectRepository(Vouchers)
    private readonly vouchersRepository: Repository<Vouchers>, 
    @InjectRepository(UseVouchers)
    private readonly useVouchersRepository: Repository<UseVouchers>, 
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>, 

    private readonly dataSource : DataSource
  ){
    super(vouchersRepository)
  }


  async usingVouchers(useVoucherDto: UseVoucherDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      // check using voucher
      const useVoucher = await this.useVouchersRepository.createQueryBuilder('useVouchers')
      .where('useVouchers.accountsId = :accountsId AND useVouchers.vouchersId = :voucherId', { accountsId: useVoucherDto.accountId, voucherId: useVoucherDto.voucherId })
      .getOne();
      
      if (useVoucher) {
        throw new BadRequestException('Voucher has been used')
      }


      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
      .where('accounts.id = :id', { id: useVoucherDto.accountId })
      .andWhere('accounts.deletedAt IS NULL')
      .andWhere('accounts.isActive = :isActive', { isActive: true})
      .getOne();

      if (!account) {
        throw new BadRequestException('Account not found or is lock')
      }

      // check voucher
      const voucher = await this.vouchersRepository.createQueryBuilder('vouchers')
      .where('vouchers.id = :voucherId', { voucherId: useVoucherDto.voucherId })
      .andWhere('vouchers.deletedAt IS NULL')
      .andWhere('vouchers.startDate <= :startDate ', { startDate: new Date()})
      .andWhere(' vouchers.endDate >= :endDate', {  endDate: new Date() })
      .andWhere('vouchers.quantity > 0')
      .getOne();

      
      if (!voucher) { 
        throw new BadRequestException('Voucher not found or is expired')
      }
    
    
      let newUseVoucher =  this.useVouchersRepository.create({
        usingDate: new Date(),
        accounts: account,
        vouchers: voucher
      })
      
      await this.useVouchersRepository.save(newUseVoucher);

      voucher.quantity--;
      await this.vouchersRepository.save(voucher);
      
      return {
        message: 'Voucher used successfully'
      };

      
   

    } catch (error) {
      CommonException.handle(error)
    }
  }
}
