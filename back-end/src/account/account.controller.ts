import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { plainToInstance } from 'class-transformer';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    const data = this.accountService.createAccountNoVerifyOTP(createAccountDto);
    return plainToInstance(Accounts, data)
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("READ_ACCOUNT")
  @Get()
  getAllAccount(
    @Query('search') search: string,  // add search query parameter here`
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',  // add sort query parameters here`
  ) {
    console.log("ádas")
    const data =  this.accountService.getAllAccount(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Accounts, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    updateAccountDto.id = id;
    return this.accountService.updateAccount( updateAccountDto);
  }
  @Patch('lock/:id')
  lockAccount(@Param('id') id: string) {
    return this.accountService.lockAccount( id);
  }
  @Patch('reset-password/:id')
  resetPassword(@Param('id') id: string) {
    return this.accountService.resetPassword(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountService.deleteSoft(id);
  // }
}
