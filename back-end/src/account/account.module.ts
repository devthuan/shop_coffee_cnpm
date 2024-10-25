import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserInformation } from 'src/user-information/entities/user-information.entity';
import { MailModule } from 'src/mail/mail.module';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Roles } from 'src/role/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Roles, UserInformation]),
    forwardRef(() =>AuthModule ),
    MailModule
  ],
  controllers: [AccountController],
  providers: [AccountService, PermissionsGuard],
})
export class AccountModule {}
