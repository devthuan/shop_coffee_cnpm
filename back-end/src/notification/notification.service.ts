import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { BaseService } from 'src/common/baseService';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { NotificationAccounts } from './entities/notification-account.entity';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  
  constructor(
    @InjectRepository(Notification) 
    private readonly notificationRepository: Repository<Notification>,
    
    @InjectRepository(NotificationAccounts)
    private readonly notificationAccountRepository: Repository<NotificationAccounts>,


    @InjectRepository(Accounts) private readonly accountRepository: Repository<Accounts>,

    private readonly dataSource: DataSource
  ){
    super(notificationRepository)
  }

  async allNotificationByAccount(
    accountId: string,
    search: string,
    page : number = 1,
    limit : number = 10,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: NotificationAccounts[]}>{
    try {

      const notificationAccounts = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
      .leftJoinAndSelect('notificationAccounts.notification', 'notification')
      .where('notificationAccounts.accountsId = :accountId', { accountId })
      .andWhere('notificationAccounts.deletedAt IS NULL')

      if (search) {
        notificationAccounts.andWhere('notification.title LIKE :search', { search: `%${search}%` });
      }

      const total = await notificationAccounts.getCount();
      const totalPage = Math.ceil(total / limit);
      const data = await notificationAccounts
       .skip( (page -1 ) * limit)
       .take(limit)
       .orderBy(`notificationAccounts.${sortBy}`, sortOrder)
       .getManyAndCount();
       
       
       
       return {
        total,
        currentPage: +page,
        totalPage,
        limit,
        data: data[0]
      };



    } catch (error) {
      CommonException.handle(error)
    }
  }

  async create(createNotificationDto: CreateNotificationDto) : Promise<Notification> {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      // check account
      const account = await this.accountRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', { id: createNotificationDto.accountId})
        .andWhere('accounts.deletedAt IS NULL')
        .andWhere('accounts.isActive = :isActive', { isActive: true})
        .getOne();

      if (!account) {
        throw new BadRequestException('Account not found or blocked.');
      }

      // create notification
      const notification = this.notificationRepository.create({
        title: createNotificationDto.title,
        content: createNotificationDto.content,
        account,
        isActive: true
      });
      await queryRunner.manager.save(notification)

      switch (createNotificationDto.typeSend){
        case 'all' : {
          console.log(createNotificationDto.typeSend)
          const allAccounts = await this.accountRepository.createQueryBuilder('accounts')
          .where('accounts.deletedAt IS NULL')
          .andWhere('accounts.isActive = :isActive', { isActive: true})
          .getMany();
          
          for (const account of allAccounts) {
            const notificationAccount = this.notificationAccountRepository.create({
              isRead: false,
              accounts: account,
              notification: notification
            })
            await queryRunner.manager.save(notificationAccount)
          }

        }
        break;
        case 'role' : {
          const accountsByRole = await this.accountRepository.createQueryBuilder('accounts')
          .leftJoinAndSelect('accounts.role', 'role')
          .where('accounts.deletedAt IS NULL')
          .andWhere('accounts.isActive = :isActive', { isActive: true})
          .andWhere('role.id = :roleId', { roleId: createNotificationDto.roleId})
          .getMany();

          if(accountsByRole.length === 0) {
            throw new BadRequestException('No account found with this role or role not found.');
          }
          
          for (const account of accountsByRole) {
            const notificationAccount = this.notificationAccountRepository.create({
              isRead: false,
              accounts: account,
              notification: notification
            })
            await queryRunner.manager.save(notificationAccount)
          }
          
        }
        break;
        case 'user' : {
          const accountUser = await this.accountRepository.createQueryBuilder('accounts')
          .where('accounts.deletedAt IS NULL')
          .andWhere('accounts.id = :id', {id: createNotificationDto.userId})
          .andWhere('accounts.isActive = :isActive', { isActive: true})
          .getOne();

          if (!accountUser) {
            throw new BadRequestException('Account not found or blocked.');
          }

          const notificationAccount = this.notificationAccountRepository.create({
            isRead: false,
            accounts: accountUser,
            notification: notification
          })
          await queryRunner.manager.save(notificationAccount)
        }
        break;
        default:
          throw new BadRequestException('Invalid type send.');
      }

      await queryRunner.commitTransaction()

      return notification;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      CommonException.handle(error);
    }    finally{
      await queryRunner.release();
    }
  }

  async readNotification(notiId: string): Promise<any> {
    try {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      
      const notificationAccount = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
       .where('notificationAccounts.id = :id', { id: notiId})
       .andWhere('notificationAccounts.isRead = :isRead', { isRead: false})
       .andWhere('notificationAccounts.deletedAt is null')
       .getOne();
      
      if (!notificationAccount) {
        throw new BadRequestException('Notification not found or already read.');
      }
      
      notificationAccount.isRead = true;
      notificationAccount.updatedAt = new Date();
      await queryRunner.manager.save(notificationAccount)
      
      await queryRunner.commitTransaction()
      
      return { message: 'Notification read successfully.' };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async deleteSoftUser(notificationAccountId: string, accountId: string): Promise<{message: string}>{
    try {
      const notificationAccount = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
       .where('notificationAccounts.id = :id', { id: notificationAccountId})
       .andWhere('notificationAccounts.accountsId = :accountsId', { accountsId: accountId})
       .andWhere('notificationAccounts.deletedAt  is null')
       .getOne();
       if (!notificationAccount) {
        throw new BadRequestException('Notification not found or not belong to this account.');
      }

      notificationAccount.deletedAt = new Date();
      notificationAccount.updatedAt = new Date();
      await this.notificationAccountRepository.save(notificationAccount);
      
      return { message: 'Notification deleted successfully.' };

    } catch (error) {
      CommonException.handle(error);
    }
  }

  async updateNoti(id: string, updateNotificationDto: UpdateNotificationDto): Promise<{message: string}> {
    try {
      // check notification is read
      const notificationAccount = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
        .leftJoinAndSelect('notificationAccounts.notification', 'notification') 
        .where('notificationAccounts.notificationId = :id', { id })
        .andWhere('notificationAccounts.isRead = :isRead', { isRead: true})
        .getOne();
        
      if (notificationAccount) {
        throw new BadRequestException('Cannot edit the notification because someone has already read it.');
      }
      await this.update(id, updateNotificationDto);
      return {
        message: 'Notification updated successfully.'
      }
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async deleteSoftNotification(id: string): Promise<{message: string}> {
    const queryRunner =  this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      
      const notification = await this.findOne(id);
      
      if (!notification) {
        throw new BadRequestException('Notification not found.');
      }

      notification.deletedAt = new Date();
      await queryRunner.manager.save(notification)

      const notificationAccounts = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
       .where('notificationAccounts.notificationId = :id', { id })
       .getMany();
       for (const notiAccount of notificationAccounts) {
        notiAccount.deletedAt = new Date();
        await queryRunner.manager.save(notiAccount)
      }      
      await queryRunner.commitTransaction()
      return {
        message: 'Notification deleted successfully.'
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      CommonException.handle(error)
    }finally{
      await queryRunner.release()
    }
  }

}
