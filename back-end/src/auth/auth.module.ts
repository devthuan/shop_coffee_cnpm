import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './entities/accounts.entity';
import { Roles } from './entities/roles.entity';
import { Functions } from './entities/functions.entity';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RoleHasFunctions } from './entities/roles_has_functions.entity';
import { MailService } from 'src/mail/mail.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CacheModule.register(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    TypeOrmModule.forFeature([Accounts, Roles, Functions, RoleHasFunctions])
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  
})
export class AuthModule {}
