import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FunctionService } from './function.service';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { plainToInstance } from 'class-transformer';
import { Functions } from './entities/functions.entity';
import { CreateFunctionDto } from './dto/create-function.dto';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('function')
@UseGuards(AuthGuardCustom)
export class FunctionController {
  constructor(private readonly functionService: FunctionService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_FUNCTION")
  @Post('')
  createFunctions(@Body() createFunction : CreateFunctionDto) {
    return this.functionService.create(createFunction)

  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("GET_ROLES")
  @Get('')
  getAllFunctions(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    limit > 100? limit = 100 : limit;
    const data = this.functionService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Functions, data);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_FUNCTION")
  @Patch('recover/:id')
  recoverSoftFunction(@Param('id') id: string){
    return this.functionService.recover(id);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_FUNCTION")
  @Delete(':id')
  deleteSoftFunction(@Param('id') id: string) {
    return this.functionService.deleteSoft(id);
  }
}
