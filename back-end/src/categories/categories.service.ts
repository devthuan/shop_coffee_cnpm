import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/baseService';

@Injectable()
export class CategoriesService extends BaseService<Categories> {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,  
  ){
    super(categoryRepository)
  }
}
