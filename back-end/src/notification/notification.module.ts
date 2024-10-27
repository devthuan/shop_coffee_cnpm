import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { NotificationAccounts } from './entities/notification-account.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification,NotificationAccounts, Accounts]),
    AuthModule
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
