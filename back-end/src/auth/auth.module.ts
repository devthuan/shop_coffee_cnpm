import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/role-permission/entities/roles.entity';
import { UserInformation } from 'src/user-information/entities/user-information.entity';

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
    TypeOrmModule.forFeature([Accounts, Roles, UserInformation])
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService]
  
})
export class AuthModule {}
