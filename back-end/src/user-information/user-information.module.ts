import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { FavoriteList } from './entities/favorite-list.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserInformation, FavoriteList, Accounts])
  ],
  controllers: [UserInformationController],
  providers: [UserInformationService],
})
export class UserInformationModule {}
