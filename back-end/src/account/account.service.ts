import { BadRequestException, forwardRef, Inject, Injectable, UseGuards } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from 'src/common/baseService';
import { CommonException } from 'src/common/exception';
import { AuthService } from 'src/auth/auth.service';
import { UserInformation } from 'src/user-information/entities/user-information.entity';
import { MailService } from 'src/mail/mail.service';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { Roles } from 'src/role/entities/roles.entity';

@Injectable()
export class AccountService extends BaseService<Accounts> {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,  // inject account repository here`
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,  // inject account repository here`
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,  // inject account repository here`

    @Inject(forwardRef(() =>AuthService))
    private authService: AuthService,
    
    private mailService: MailService,
    private readonly dataSource: DataSource,
  ){
    super(accountsRepository);
  }

  async createAccountNoVerifyOTP(createAccountDto : CreateAccountDto): Promise<{statusCode: number, status : string, message: string, data: Accounts}> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {

      await queryRunner.connect()
      await queryRunner.startTransaction()

      const existingAccountEmail = await this.accountsRepository.findOne({
        where: { email: createAccountDto.email },
      });
      if (existingAccountEmail) throw new BadRequestException('Email already exists')
      
        const existingAccountUsername = await this.accountsRepository.findOne({
        where: { userName: createAccountDto.username },
      });
      if (existingAccountUsername) throw new BadRequestException('Username already exists')
      
      const  role = await this.rolesRepository.createQueryBuilder('roles')
      .where('roles.codeName = :codeName', {codeName: createAccountDto.role})
      .andWhere('roles.deletedAt is null')
      .getOne();

      if (!role){
        throw new BadRequestException('Role not found')
      } 


      const new_user = this.accountsRepository.create({
        userName: createAccountDto.username,
        email: createAccountDto.email,
        password:  await this.authService.hashingPassword(createAccountDto.password),
        balance: 0,
        ip: '127.0.0.1',
        device: 'web',
        typeLogin: 'system',
        lastLogin: null,
        isActive: true,
        role: role 
      })
      await this.accountsRepository.save(new_user)

     

      const newAccountInfo =  this.userInformationRepository.create({
        email: createAccountDto.email,
        account: new_user
      })
      await queryRunner.manager.save(newAccountInfo)
        
      await queryRunner.commitTransaction()

      return {
        statusCode: 201,
        status:'success',
        message: 'User registered successfully',
        data: new_user
      }
      
    } catch (error) {
      await queryRunner.rollbackTransaction()
      if (error.code === 'ER_DUP_ENTRY') {
            return {
            statusCode: 400,
            status: 'error',
            message: 'Email or username already exists',
            data: null
            }
        }else {
            CommonException.handle(error)
        }
    }finally {
      await queryRunner.release();
    }

     
  }

  async getAllAccount( 
      search: string,
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC',
      filters: Record<string, any> = {} // Nhận filters từ controller
    ): Promise<{ message: string; total: number;  currentPage: number; totalPage: number; limit : number; data: Accounts[]}> {
      try {
        const query = this.accountsRepository.createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.role', 'role')
        .leftJoinAndSelect('accounts.userInformation', 'userInformation')
          .where('accounts.deletedAt is null')

          if (search) {
            query
             .andWhere('LOWER(accounts.email) LIKE LOWER(:search) OR LOWER(accounts.username) LIKE LOWER(:search) ', { search: `%${search}%` })
          }

          // Filter conditions
            Object.keys(filters).forEach((key) => {
              if (filters[key] !== undefined && filters[key] !== null) {
                let value = filters[key];
                
                // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
                if (value === 'true') value = true;
                if (value === 'false') value = false;
                if(key === 'role'){
                  key = "codeName"
                  query.andWhere(`role.${key} = :${key}`, { [key]: value });
                  
                }else {
                  query.andWhere(`accounts.${key} = :${key}`, { [key]: value });

                }
              }
            });

        const [result, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(`accounts.${sortBy}`, sortOrder)
            .getManyAndCount();

        const totalPage = Math.ceil(total / limit);

        return {
          message: 'Success',
          total: total,
          currentPage: page,
          totalPage: totalPage,
          limit: limit,
          data: result
        }
        
      } catch (error) {
        CommonException.handle(error)
      }
  }

  async lockAccount(accountId: string): Promise<{statusCode: number, status: string, message: string}> {
    try {
      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
      .where('accounts.id = :id', {id: accountId})
      .andWhere('accounts.deletedAt is null')
      .getOne();
      
      if(!account) {
        throw new BadRequestException('Account not found.')
      }
    
      
      // lock account
      account.isActive = !account.isActive;
      account.updatedAt = new Date();
      await this.accountsRepository.save(account);
      if(account.isActive){
        return {
          statusCode: 200,
          status:'success',
          message: 'Account unlocked successfully'
        }
        
      }else {
        return { 
          statusCode: 200,
          status: 'success',
          message: 'Account locked successfully' 
        }
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async updateAccount(updateAccountDto : UpdateAccountDto): Promise<{statusCode: number, status: string, message: string}> {
    try {
      const checkAccount = await this.accountsRepository.createQueryBuilder('accounts')
        .leftJoinAndSelect('accounts.role', 'role')
        .where('accounts.id = :id', { id: updateAccountDto.id })
        .andWhere('accounts.deletedAt is null')
        .getOne();

        if (!checkAccount) {

          throw new BadRequestException('Account not found.')
        }

        // check username
        if (updateAccountDto.userName && checkAccount.userName!== updateAccountDto.userName) {
          const checkUsername = await this.accountsRepository.findOne({ where: { userName: updateAccountDto.userName } });
          if (checkUsername) {
            throw new BadRequestException('Username already exists.');
          }
        }

        if (updateAccountDto.role && checkAccount.role.codeName!== updateAccountDto.role) {
          const role = await this.rolesRepository.findOne({ where: { codeName: updateAccountDto.role } });
          if (!role) {
            throw new BadRequestException('Role not found.');
          }
        
          checkAccount.role = role;
          checkAccount.userName = updateAccountDto.userName
          checkAccount.updatedAt = new Date();  
        }
        await this.accountsRepository.save(checkAccount);
      return { 
        statusCode: 200,
        status: 'success',
        message: 'Account updated successfully.' }
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async resetPassword(accountId : string): Promise<{statusCode: number, status: string, message: string}> {
    try {
      const account = await this.accountsRepository.createQueryBuilder('accounts')
      .where('accounts.id = :id', { id: accountId })
      .getOne();
      
      if (!account) {
        throw new BadRequestException('Account not found.')
      }
      
      const newPassword = Math.random().toString(36).slice(-8);

      const hashedPassword = await this.authService.hashingPassword(newPassword);

      // send email to account with new password
      await this.mailService.sendEmail(account.email, "Cấp mật khẩu mới", newPassword, newPassword)
      
      account.password = hashedPassword;
      account.updatedAt = new Date()
      await this.accountsRepository.save(account);
      
      return {
        statusCode: 200,
        status:'success',
        message: 'Password reset successfully.'
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }

}
