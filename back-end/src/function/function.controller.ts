import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FunctionService } from './function.service';
import { UpdateFunctionDto } from './dto/update-function.dto';
import { plainToInstance } from 'class-transformer';
import { Functions } from './entities/functions.entity';
import { CreateFunctionDto } from './dto/create-function.dto';

@Controller('function')
export class FunctionController {
  constructor(private readonly functionService: FunctionService) {}

    
  @Post('')
  createFunctions(@Body() createFunction : CreateFunctionDto) {
    return this.functionService.create(createFunction)

  }
  
  @Get('')
  getAllFunctions(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) {
    const data = this.functionService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Functions, data);
  }

  @Patch('recover/:id')
  recoverSoftFunction(@Param('id') id: string){
    return this.functionService.recover(id);
  }
  
  @Delete(':id')
  deleteSoftFunction(@Param('id') id: string) {
    return this.functionService.deleteSoft(id);
  }
}
