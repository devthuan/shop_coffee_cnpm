import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Functions } from './entities/functions.entity';
import { BaseService } from 'src/common/baseService';

@Injectable()
export class FunctionService extends BaseService<Functions> {
    constructor(
        
        @InjectRepository(Functions)
        private readonly functionsRepository: Repository<Functions>, 
        
    ){
        super(functionsRepository)
    }


}
