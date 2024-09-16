import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { RespondInterfacePOST } from './interface';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';


@Injectable()
export class AuthService {

  constructor(
    @Inject(CACHE_MANAGER) 
    private cacheManager: Cache,

    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>, 
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>, 
    @InjectRepository(Functions)
    private readonly functionsRepository: Repository<Functions>, 
    @InjectRepository(RoleHasFunctions)
    private readonly roleHasFunctionsRepository: Repository<RoleHasFunctions>, 
    

    private readonly dataSource: DataSource,
    private readonly mailService: MailService

  ){}

  async create(createAuthDto: CreateAuthDto) : Promise<RespondInterfacePOST> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {

      const new_user = this.accountsRepository.create({
        userName: createAuthDto.username,
        email: createAuthDto.email,
        password: await this.hashingPassword(createAuthDto.password),
        balance: 0,
        ip: '127.0.0.1',
        device: 'web',
        typeLogin: 'system',
        lastLogin: null,
        isActive: true,
        role: await this.rolesRepository.findOne({where: {id: '1'}})
      })
      await this.accountsRepository.save(new_user)

      // generate otp 
      const otp = this.generateOTP();
      const otpHash = await this.hashingPassword(otp.toString())
      // save otp to redis
      this.cacheManager.set(createAuthDto.email, otpHash);
      console.log(this.cacheManager.get(createAuthDto.email))
      // send otp to email
      await this.mailService.sendEmail(
        createAuthDto.email,
        'Mã otp xác thực tài khoản',
        otp.toString(),
        otp.toString()
      )

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
            message: 'Email or number phone already exists',
            data: null
            }
        }else {
            throw error;
        }
    }finally {
      await queryRunner.release();
    }
  }

  async sendOTP(email: string) : Promise<any>{
      try {
          const cachedData = await this.cacheManager.get(email);
          if (cachedData) {
              
              return {
                  statusCode: 429,
                  status: "error",
                  message: "You can only request a new OTP every 3 minutes",
              };
          }

          const otp : number = this.generateOTP();
          const hashedOTP : string = await this.hashingPassword(otp.toString());
          await this.cacheManager.set(email, hashedOTP);
        
          await this.mailService.sendEmail(
              email,
              "Mã OTP đăng ký tài khoản",
              otp.toString(),
              otp.toString()
          )
          return {
              statusCode: 200,
              status: "success",
              message: "OTP sent successfully"
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
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
