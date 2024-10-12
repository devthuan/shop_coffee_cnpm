import { Injectable } from '@nestjs/common';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { DataSource, Repository } from 'typeorm';
import { FavoriteList } from './entities/favorite-list.entity';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';

@Injectable()
export class UserInformationService {

  constructor(
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,  
    @InjectRepository(FavoriteList)
    private readonly favoriteListRepository: Repository<FavoriteList>,  
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,  


    private readonly dataSource: DataSource

  ){}

  async create(accountId: string, createUserInformationDto: CreateUserInformationDto): Promise<UserInformation> {
    try {
      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: accountId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
        
      if (!account) {
        throw new Error('Account not found');
      }
      
      // create user information
      const userInformation = this.userInformationRepository.create(createUserInformationDto);
      await this.userInformationRepository.save(userInformation);
      
      // create favorite list
      const favoriteList = this.favoriteListRepository.create({
        account: account,
        products: null
      });
      await this.favoriteListRepository.save(favoriteList);
      
      return userInformation;

     
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
        throw new Error('User Information not found');
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
        throw new Error('Account not found');
      }
      let userInfo = account.userInformation
    
      
      const result = await this.userInformationRepository.update(userInfo[0].id,updateUserInformationDto);
      
      if (result.affected === 0) {
        throw new Error('User Information not found');
      }else {
        return {
          message: 'Updated successfully',
        }
      }
      

      

    } catch (error) {
      CommonException.handle(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userInformation`;
  }
}
