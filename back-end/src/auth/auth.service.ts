import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';

import { RespondInterfacePOST } from '../common/interface';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from 'src/role-permission/entities/roles.entity';
import { UserInformation } from 'src/user-information/entities/user-information.entity';


@Injectable()
export class AuthService {

  constructor(
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,

    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>, 
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>, 
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>, 
 

    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService

  ){}

  async create(createAuthDto: CreateAuthDto) : Promise<RespondInterfacePOST> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const new_user = this.accountsRepository.create({
        userName: createAuthDto.username,
        email: createAuthDto.email,
        password: await this.hashingPassword(createAuthDto.password),
        balance: 0,
        ip: '127.0.0.1',
        device: 'web',
        typeLogin: 'system',
        lastLogin: null,
        isActive: false,
        role: await this.rolesRepository.findOne({where: {id: '1'}})
      })
      await this.accountsRepository.save(new_user)

      // generate otp 
      const otp = this.generateOTP();
      const otpHash = await this.hashingPassword(otp.toString())
      // save otp to redis
      this.cacheManager.set(createAuthDto.email, otpHash, 3000);
      // send otp to email
      await this.mailService.sendEmail(
        createAuthDto.email,
        'Mã otp xác thực tài khoản',
        otp.toString(),
        otp.toString()
      )

      const newAccountInfo =  this.userInformationRepository.create({
        email: createAuthDto.email,
        account: new_user
      })
      await queryRunner.manager.save(newAccountInfo)
        

  
      await queryRunner.commitTransaction()

      return {
        statusCode: 201,
        status:'success',
        message: 'User registered successfully',
        data: null
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
            throw error;
        }
    }finally {
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto) : Promise<RespondInterfacePOST> {
    try {
      const user = await this.dataSource
      .getRepository(Accounts)
      .createQueryBuilder('accounts')
      .leftJoinAndSelect('accounts.role', 'roles')
      .where('(accounts.email = :email OR accounts.username = :username)', {
        email: loginDto.email || null,     // Nếu không có email, dùng null
        username: loginDto.username || null,  // Nếu không có username, dùng null
      })
      .andWhere('accounts.deletedAt is null')
      .getOne()

      if (!user) {
        return {
          statusCode: 401,
          status: 'error',
          message: 'Invalid username or password',
          data: null
        }
      }
      if(!user.isActive){
        return {
          statusCode: 401,
          status: 'error',
          message: 'Account is not active',
          data: null
        }
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        return {
          statusCode: 401,
          status: 'error',
          message: 'Invalid username or password',
          data: null
        }
      }

      const payload = {
        id: user.id,
        username: user.userName,
        email: user.email,
        role: user.role.codeName
      }
      const token = await this.jwtService.signAsync(payload)

      user.lastLogin = new Date();
      user.ip = loginDto.ip;
      await this.accountsRepository.save(user);
      return {
        statusCode: 200,
        status:'success',
        message: 'Logged in successfully',
        data: {
          accessToken : token
        }
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        status: 'error',
        message: 'Internal Server Error',
        data: null
      }
    }
    
  }

  async sendOTP(email: string) : Promise<RespondInterfacePOST>{
      try {
          const cachedData = await this.cacheManager.get(email);
          if (cachedData) {
              
              return {
                  statusCode: 429,
                  status: "error",
                  message: "You can only request a new OTP every 3 minutes",
                  data: null
              };
          }

          const otp : number = this.generateOTP();
          const hashedOTP : string = await this.hashingPassword(otp.toString());
          await this.cacheManager.set(email, hashedOTP, 6000);

          console.log(this.cacheManager.get(email))
          await this.mailService.sendEmail(
              email,
              "Mã OTP đăng ký tài khoản",
              otp.toString(),
              otp.toString()
          )
          return {
              statusCode: 200,
              status: "success",
              message: "OTP sent successfully",
              data: null
          };
          
      } catch (error) {
          console.log(error)
          throw new Error(error)
      }
  }

  async verifyOTP(email : string, otp : string) : Promise<any> {
      try {
          const otpCache : string = await this.cacheManager.get(email)
          console.log(otpCache)
          if(!otpCache) {
              return {
              statusCode: 400,
              status: "fail",
              message: "OTP is not found.",
              };
          }
          const checkOTP = await this.verifyPassword(otp,otpCache)
          if(!checkOTP) {
              return {
              statusCode: 400,
              status: "fail",
              message: "OTP is not correct"
              };
          }

          const user = await this.accountsRepository.findOne({
              where: {
                  email: email,
                  deletedAt:  null
              }
          })

          if(!user) {
              return {
              statusCode: 400,
              status: "fail",
              message: "Email is not found."
              };
          }
          user.isActive = true
          user.updatedAt = new Date()
          await this.accountsRepository.save(user)
          

          await this.cacheManager.del(email)
          return {
              statusCode: 200,
              status: "success",
              message: "Account is verified successfully."
          };
      } catch (error) {
          console.log(error)
          throw new Error(error)    
      }
  }


  async changePassword(changePasswordDto : ChangePasswordDto): Promise<RespondInterfacePOST> {
    try {
      const user = await this.accountsRepository.findOne({
        where: {
          email: changePasswordDto.email,
          deletedAt: null
        }
      })

      if (!user) {
        return {
          statusCode: 404,
          status: 'error',
          message: 'User not found',
          data: null
        }
      }

      const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
      if (!isMatch) {
        return {
          statusCode: 401,
          status: 'error',
          message: 'Invalid old password',
          data: null
        }
      }

      const newPassword = await this.hashingPassword(changePasswordDto.newPassword);
      user.password = newPassword;
      user.updatedAt = new Date();
      await this.accountsRepository.save(user);

      return {
        statusCode: 200,
        status:'success',
        message: 'Password changed successfully',
        data: null
      }
      
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        status: 'error',
        message: 'Internal Server Error',
        data: null
      }
    }
  }

  async forgotPassword(email: string): Promise<RespondInterfacePOST> {
    try {
      const user = await this.accountsRepository.findOne({
        where: {
          email: email,
          deletedAt: null
        }
      })

      if(!user){
        return {
          statusCode: 404,
          status: 'error',
          message: 'User not found',
          data: null
        }
      }

      const newPassword = this.generatePassword();
      const hashedNewPassword = await this.hashingPassword(newPassword);
      user.password = hashedNewPassword;
      user.updatedAt = new Date();
      await this.accountsRepository.save(user);
      
      await this.mailService.sendEmail(
        email,
        "Mật khẩu mới",
        "Mật khẩu của bạn đã được thay đ��i thành công",
        `<p>Mật khẩu mới của bạn là: ${newPassword}</p>`
      )

      return {
        statusCode: 200,
        status:'success',
        message: 'Password reset successfully',
        data: null
      }

      
    } catch (error) {
      return {
        statusCode: 500,
        status: 'error',
        message: 'Internal Server Error',
        data: null
      }
    }
  }

  async hashingPassword(password: string): Promise<string> {
      let salt : number = 10;
      let hashedPassword : string = await bcrypt.hash(password, salt);
      return hashedPassword;
  }

  async verifyPassword(originPassword: string, hashPassword: string): Promise<boolean> {
      return await bcrypt.compare(originPassword, hashPassword);
  }

  generateOTP() {
      let otp = Math.floor(100000 + Math.random() * 900000);
      return otp;
  }

  generatePassword(): string {
      const password = Math.random().toString(36).substr(2, 10);
      return password;
  }



}
