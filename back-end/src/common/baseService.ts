import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RespondInterfacePOST } from './interface';

@Injectable()
export class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<RespondInterfacePOST> {
    try {
      return {
        statusCode: 200,
        status: 'success',
        message: 'Data fetched successfully',
        data: await this.repository.find(),
      }      
    } catch (error) {
      return {
        statusCode: 500,
        status: 'error',
        message: 'Failed to fetch data',
        data: null,
      }
    }
  }

  // async findOne(id: number): Promise<RespondInterfacePOST> {
  //   const entity = await this.repository.findOne({ where: { id } });
  //   if (!entity) {
  //     throw new NotFoundException(`Entity with ID ${id} not found`);
  //   }
  //   return entity;
  // }

  // async create(data: any): Promise<T> {
  //   const entity = this.repository.create(data);
  //   return this.repository.save(entity);
  // }

  // async update(id: number, data: any): Promise<T> {
  //   const entity = await this.findOne(id);
  //   Object.assign(entity, data);
  //   return this.repository.save(entity);
  // }

  // async remove(id: number): Promise<void> {
  //   const entity = await this.findOne(id);
  //   await this.repository.remove(entity);
  // }
}
