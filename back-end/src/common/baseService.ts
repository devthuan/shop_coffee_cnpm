import { DeepPartial, DeleteResult, FindOptionsWhere, IsNull, Like, Repository } from 'typeorm';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RespondInterfacePOST } from './interface';
import { BaseEntity } from './base.entity';
import { skip } from 'node:test';
import { CommonException } from './exception';

export class BaseService<T extends BaseEntity> {
  constructor(
    
    private readonly repository: Repository<T>, // Inject repository for any entity T
  ) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    try {
      if(createDto['name'] ){
        const existingEntity = await this.repository.findOne({
          where: { name: createDto['name'] } as FindOptionsWhere<T>
        });
        
        if(existingEntity ) {
          throw new ConflictException('Name is already taken')
        }
  
      }
      
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
       
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async findAll(
      search: string,
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC'
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: T[]}> 
    { 
    try {
        const queryBuilder = this.repository.createQueryBuilder('entity')
          .where('entity.deletedAt IS NULL')

          if (search) {
            queryBuilder.andWhere('entity.name LIKE :search', { search: `%${search}%` });
          }

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`entity.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

      return {
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }
  async findAllDeleted(
      search: string,
      page : number = 1,
      limit : number = 10,
      sortBy : string = 'createdAt',
      sortOrder: 'ASC' | 'DESC' = 'ASC'
    ): Promise<{ message: string; total: number;  currentPage: number; totalPage: number; limit : number; data: T[]}> 
    { 
    try {
        const queryBuilder = this.repository.createQueryBuilder('entity')
          .where('entity.deletedAt IS NOT NULL')

          if (search) {
            queryBuilder.andWhere('entity.name LIKE :search', { search: `%${search}%` });
          }

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`entity.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);

      return {
        message: 'List of deleted data',
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async findOne(id: string): Promise<T> {
  try {
      const data = await this.repository.createQueryBuilder('entity')
        .where('entity.id = :id', { id }) // Kiểm tra ID
        .andWhere('entity.deletedAt IS NULL') // Kiểm tra deletedAt là null
        .getOne();

      if (!data) {
        throw new NotFoundException('Data not found');
      }

      return data;
    } catch (error) {
      CommonException.handle(error)
    }
  }


  async update(id: string, partialEntity: QueryDeepPartialEntity<T>) :Promise<any> {
    try {
      if(partialEntity['name']) {
      
      const existingEntity = await this.repository.createQueryBuilder('entity')
        .where('entity.name = :name ', {name:  partialEntity['name']} )
        .andWhere('entity.deletedAt is null')
        .getOne();

      if(existingEntity ) {
        throw new ConflictException('Name is already taken')
      }
    }
  
    const {affected } = await this.repository.update(id, partialEntity);
    console.log(affected);
    if(affected > 0) {
        return {message: 'Updated successfully.'}
      
      }else {
          throw new BadRequestException()
        }
      //  return await this.repository.update(id, partialEntity);

    } catch (error) {
      CommonException.handle(error)
    }
  }

  async deleteSoft(id: string): Promise<object> {
    try {
      const data = await this.repository.createQueryBuilder('entity')
      .where('entity.id = :id', {id})
      .andWhere('entity.deletedAt IS NULL')
      .getOne()
      console.log(data)
      if (!data) {
        throw new NotFoundException('Data not found')
      }
      
      data.deletedAt = new Date();
      await this.repository.save(data);

      return { message: 'Delete success' }


    } catch (error) {
      CommonException.handle(error)
    }
  }

  async recover(id: string): Promise<object> {
    try {
      const data = await this.repository.createQueryBuilder('entity')
        .where('entity.id = :id', {id})
        .andWhere('entity.deletedAt is not null')
        .getOne()
      
        if(!data) {
          throw new NotFoundException('Data not found')
        }
        
        data.deletedAt = null
        await this.repository.save(data);
        return {message: "recover data successfully."}
    } catch (error) {
      CommonException.handle(error)
    }
  }
}