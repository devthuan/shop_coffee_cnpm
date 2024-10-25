import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { BaseService } from 'src/common/baseService';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SupplierService extends BaseService<Supplier> {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>
  ){
    super(supplierRepository)
  }
}
