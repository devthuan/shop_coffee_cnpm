import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { BaseService } from 'src/common/baseService';
import { Attributes } from './entities/attributes.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';

@Injectable()
export class AttributeService extends  BaseService<Attributes> {
  constructor(
    @InjectRepository(Attributes)
    private readonly attributeRepository: Repository<Attributes>, // Inject repository for any entity Attributes
  ){
    super(attributeRepository);

  }

}
