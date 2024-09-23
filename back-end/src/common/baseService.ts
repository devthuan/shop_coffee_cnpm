import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RespondInterfacePOST } from './interface';
import { BaseEntity } from './base.entity';

export class BaseService<T extends BaseEntity> {
  constructor(
    private readonly repository: Repository<T>, // Inject repository for any entity T
  ) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  // async findOne(id: string): Promise<T> {
  //   return await this.repository.findOne({where: {id}});
  // }

  async update(id: string, partialEntity: QueryDeepPartialEntity<T>) {
   return await this.repository.update(id, partialEntity);
  }

  async deleteSoft(id: string): Promise<object> {
    try {
      
      const data = await this.repository.findOne({
        where: { 
          id: id as any,
          deletedAt: null
         } as any,
      })


      if (!data) {
        throw new Error('Data not found')
      }
      
      data.deletedAt = new Date();
       await this.repository.save(data);

      return { message: 'Delete success' }


    } catch (error) {
      throw new Error(error)
    }
  }
}