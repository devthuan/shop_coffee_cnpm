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
@UseGuards(AuthGuardCustom)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    const data = this.accountService.createAccountNoVerifyOTP(createAccountDto);
    return plainToInstance(Accounts, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("VIEW_ACCOUNT")
  @Get()
  getAllAccount(
    @Query('search') search: string,  // add search query parameter here`
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',  // add sort query parameters here`
    @Query() query: Record<string, any> // Lấy tất cả query params còn lại
  ) {
     const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    const data =  this.accountService.getAllAccount(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Accounts, data)
  }

  @UseGuards(PermissionsGuard)
  @Permissions("VIEW_ACCOUNT")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);

  }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_ACCOUNT")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    updateAccountDto.id = id;
    return this.accountService.updateAccount( updateAccountDto);
  }
  @UseGuards(PermissionsGuard)
  @Permissions("LOCK_ACCOUNT")
  @Patch('lock/:id')
  lockAccount(@Param('id') id: string) {
    return this.accountService.lockAccount( id);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("RESET_PASSWORD")
  @Patch('reset-password/:id')
  resetPassword(@Param('id') id: string) {
    return this.accountService.resetPassword(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountService.deleteSoft(id);
  // }
}
