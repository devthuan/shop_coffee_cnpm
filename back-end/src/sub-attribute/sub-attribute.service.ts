import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { SubAttributes } from './entities/sub-attribute.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubAttributeService extends BaseService<SubAttributes> {
  constructor(
    @InjectRepository(SubAttributes)
    private readonly subAttributeRepository: Repository<SubAttributes>
  ){
    super(subAttributeRepository);
  }
}
