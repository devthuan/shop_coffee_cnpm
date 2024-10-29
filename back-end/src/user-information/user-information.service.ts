import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserInformationService {

  constructor(
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,  

    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,  

    private readonly productService: ProductService,
    private readonly dataSource: DataSource

  ){}

  async create(accountId: string, createUserInformationDto: CreateUserInformationDto): Promise<UserInformation> {
    try {
      // // check account
      // const account = await this.accountsRepository.createQueryBuilder('accounts')
      //   .where('accounts.id = :id', {id: accountId})
      //   .andWhere('accounts.deletedAt is null')
      //   .andWhere('accounts.isActive = :isActive', {isActive: true})
      //   .getOne();
        
      // if (!account) {
      //   throw new BadRequestException('Account not found');
      // }
      
      // // create user information
      // const userInformation = this.userInformationRepository.create(createUserInformationDto);
      // await this.userInformationRepository.save(userInformation);
      
      // // create favorite list
      // const favoriteList = this.favoriteListRepository.create({
      //   account: account,
      //   products: null
      // });
      // await this.favoriteListRepository.save(favoriteList);
      
      // return userInformation;
      return null;
     
    } catch (error) {
      CommonException.handle(error)
    }
  }

  findAll() {
    return `This action returns all userInformation`;
  }

  async findOneByAccount(accountId: string): Promise<Accounts> {
    try {
      const userInformation = await this.accountsRepository.createQueryBuilder('accounts')
      .leftJoinAndSelect('accounts.userInformation', 'userInformation')
      .where('accounts.id = :id',{id: accountId})
      .andWhere('accounts.deletedAt  is null')
      .andWhere('accounts.isActive  = :isActive', {isActive: true})
      .getOne();

      if (!userInformation) {
        throw new BadRequestException('User Information not found');
      }
      
      return userInformation;
      
    } catch (error) {
      CommonException.handle(error)
    }
  }

 

  async update(accountId: string, updateUserInformationDto: UpdateUserInformationDto): Promise<{message: string}> {
     try {
      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.userInformation', 'userInformation')
        .where('accounts.id = :id', {id: accountId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
        
      if (!account) {
        throw new BadRequestException('Account not found');
      }
      let userInfo = account.userInformation

      if(!userInfo.id) {
        throw new BadRequestException('data in information not found');
      }
    
      
      const result = await this.userInformationRepository.update(userInfo.id,updateUserInformationDto);
      
      if (result.affected === 0) {
        throw new BadRequestException('User Information not found');
      }else {
        return {
          message: 'Updated successfully',
        }
      }
      

      

    } catch (error) {
      CommonException.handle(error)
    }
  }

  
}
