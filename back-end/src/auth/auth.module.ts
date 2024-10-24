import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UserInformation } from 'src/user-information/entities/user-information.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { Roles } from 'src/role/entities/roles.entity';
import { PermissionsGuard } from './permisson.guard';
import { RoleModule } from 'src/role/role.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';
import { AccountModule } from 'src/account/account.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    TypeOrmModule.forFeature([Accounts, Roles, UserInformation]),
    MailModule,
 
    RolePermissionModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService]
  
})
export class AuthModule {}
