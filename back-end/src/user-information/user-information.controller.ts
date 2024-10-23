import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { CreateUserInformationDto, ProductIdDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { plainToInstance } from 'class-transformer';
import { Accounts } from 'src/auth/entities/accounts.entity';

@Controller('user-information')
@UseGuards(AuthGuardCustom)
export class UserInformationController {
  constructor(private readonly userInformationService: UserInformationService) {}

  // @Post()
  // create(@Req() request: Request, @Body() createUserInformationDto: CreateUserInformationDto) {
  //   let accountId =  request['user'].id;  // Get user's id from JWT token
  //   return this.userInformationService.create(accountId, createUserInformationDto);
  // }
  
  @Get('user')
  findOne(@Req() request: Request) {
    let accountId =  request['user'].id;  // Get user's id from JWT token
    let data = this.userInformationService.findOneByAccount(accountId);
    return plainToInstance(Accounts, data)
  }

  @Patch()
  update(@Req() request: Request, @Body() updateUserInformationDto: UpdateUserInformationDto) {
    let accountId =  request['user'].id;  // Get user's id from JWT token
    return this.userInformationService.update(accountId, updateUserInformationDto);
  }

}
