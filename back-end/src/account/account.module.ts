import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Roles } from 'src/role-permission/entities/roles.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserInformation } from 'src/user-information/entities/user-information.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Roles, UserInformation]),
    AuthModule,
    MailModule
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
