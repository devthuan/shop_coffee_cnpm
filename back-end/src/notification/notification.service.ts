import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { BaseService } from 'src/common/baseService';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { NotificationAccounts } from './entities/notification-account.entity';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  
  constructor(
    @InjectRepository(Notification) 
    private readonly notificationRepository: Repository<Notification>,
    
    @InjectRepository(NotificationAccounts)
    private readonly notificationAccountRepository: Repository<NotificationAccounts>,


    @InjectRepository(Accounts) private readonly accountRepository: Repository<Accounts>,

    private roleService: RoleService,

    private readonly dataSource: DataSource
  ){
    super(notificationRepository)
  }

  async findAll(
      search: string,
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC',
      filters: Record<string, any> = {} // Nhận filters từ controller
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: Notification[]}> 
    { 
    try {
        const queryBuilder = this.notificationRepository.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.account', 'account')

          .where('notification.deletedAt IS NULL')

          if (search) {
            queryBuilder.andWhere('notification.title LIKE :search', { search: `%${search}%` });
          }

           // Filter conditions
            Object.keys(filters).forEach((key) => {
              if (filters[key] !== undefined && filters[key] !== null) {
                let value = filters[key];
                
                // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
                if (value === 'true') value = true;
                if (value === 'false') value = false;

                queryBuilder.andWhere(`notification.${key} = :${key}`, { [key]: value });
              }
            });

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`notification.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

      return {
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }
  

  async allNotificationByAccount(
    accountId: string,
    search: string,
    page : number = 1,
    limit : number = 10,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filters: Record<string, any> = {} // Nhận filters từ controller

    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: NotificationAccounts[]}>{
    try {

      const notificationAccounts = await this.notificationAccountRepository.createQueryBuilder('notificationAccounts')
      .leftJoinAndSelect('notificationAccounts.notification', 'notification')
      .where('notificationAccounts.accountsId = :accountId', { accountId })
      .andWhere('notificationAccounts.deletedAt IS NULL')

      if (search) {
        notificationAccounts.andWhere('notification.title LIKE :search', { search: `%${search}%` });
      }

      // Filter conditions
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          let value = filters[key];
          
          // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
          if (value === 'true') value = true;
          if (value === 'false') value = false;

          notificationAccounts.andWhere(`notificationAccounts.${key} = :${key}`, { [key]: value });
        }
      });

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

      let role = null
      if(createNotificationDto.roleId){
        role = await this.roleService.findOne(createNotificationDto.roleId);
      }


      // conver type send
      let typeSend = createNotificationDto.typeSend;
      if (createNotificationDto.roleId) {
        typeSend = role.name
      } else if (typeSend === "user") {
        typeSend = account.email;
      } else if (typeSend === "all") {
        typeSend = "all";
      } else {
        throw new BadRequestException('Invalid typeSend');
      }

      // create notification
      const notification = this.notificationRepository.create({
        typeSend,
        title: createNotificationDto.title,
        content: createNotificationDto.content,
        account,
        isActive: true
      });
      await queryRunner.manager.save(notification)

      switch (createNotificationDto.typeSend){
        case 'all' : {
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
          .andWhere('accounts.email = :email', {email: createNotificationDto.email})
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


   async updateNoti(id: string, updateNotificationDto: UpdateNotificationDto) :Promise<any> {
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

      const result = await this.notificationRepository.createQueryBuilder('notification')
        .where('notification.id = :id', {id})
        .andWhere('notification.deletedAt is null')
        .getOne();

      if(!result){
        throw new NotFoundException('Notification not found.')
      }

      result.title = updateNotificationDto.title
      result.content = updateNotificationDto.content
      result.updatedAt = new Date()
      
      await this.notificationRepository.save(result)

      return {
        message: 'Notification updated successfully.'
      }

    } catch (error) {
      CommonException.handle(error)
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
