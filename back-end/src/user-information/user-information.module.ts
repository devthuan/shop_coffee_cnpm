import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserInformation, Accounts]),
    ProductModule
  ],
  controllers: [UserInformationController],
  providers: [UserInformationService],
})
export class UserInformationModule {}
