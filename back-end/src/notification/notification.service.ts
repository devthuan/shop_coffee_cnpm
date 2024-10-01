import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { BaseService } from 'src/common/baseService';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  
  constructor(
    @InjectRepository(Notification) notificationRepository: Repository<Notification>
  ){
    super(notificationRepository)
  }

  async readNotification() : Promise<any> {
    
  }

}
