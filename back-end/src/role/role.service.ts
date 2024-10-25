import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';

import { BaseService } from 'src/common/baseService';

@Injectable()
export class RoleService extends BaseService<Roles> {
    constructor(

        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>, 
       
    ){
        super(rolesRepository);
    }
   
        
}
