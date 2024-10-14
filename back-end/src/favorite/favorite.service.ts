import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { BaseService } from 'src/common/baseService';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class FavoriteService extends BaseService<Favorite> {

  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>, 

    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,

    private readonly productService: ProductService,
  ){
    super(favoriteRepository)
  }
   async getListFavoriteByAccount(
    accountId: string,
    search: string,
    page : number = 1,
    limit : number = 10,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
    ): Promise<{ total: number;  currentPage: number; totalPage: number; limit : number; data: Favorite[]}>{
    try {
      const favorites =  this.favoriteRepository.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.products', 'products')
      .where('favorite.accountId = :accountId', {accountId})
      .andWhere('favorite.deletedAt is null');
      // filter
      if(search){
        favorites.andWhere('products.name LIKE :search OR products.code LIKE :search', {search: `%${search}%`});
      }

       // count total
      const total = await favorites.getCount();

      // pagination page
      const data = await favorites
        .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
        .take(limit) // Giới hạn số bản ghi trả về
        .orderBy(`favorite.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
        .getMany(); // Lấy danh sách bản ghi

      const totalPage = Math.ceil(total / limit);
      

      return {
        total,
        currentPage: +page,
        totalPage,
        limit,
        data
      };

   
    } catch (error) {
      CommonException.handle(error)
    }
  }

  async addFavoriteList(createFavoriteDto: CreateFavoriteDto): Promise<{message: string}>{
    try {
      // check account
      const account = await this.accountsRepository.createQueryBuilder('accounts')
       .where('accounts.id = :id', {id: createFavoriteDto.accountId})
       .andWhere('accounts.deletedAt is null')
       .andWhere('accounts.isActive = :isActive', {isActive: true})
       .getOne();
        
      if (!account) {
        throw new BadRequestException('Account not found');
      }

      // check existing account
      const existingFavorite = await this.favoriteRepository.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.products', 'products')
      .leftJoinAndSelect('favorite.account', 'account')
       .where('favorite.accountId = :accountId', {accountId: createFavoriteDto.accountId})
       .andWhere('favorite.productsId = :productId', {productId: createFavoriteDto.productId})
       .getOne();
        
      if (existingFavorite) {
        throw new BadRequestException('This product is already in your favorite list');
      }
          

      // check product
      const product = await this.productService.findOne(createFavoriteDto.productId)
      if (!product) {
        throw new BadRequestException('Product not found');
      }
  
      const favoriteList =  this.favoriteRepository.create({
        account: account,
        products: product

      })
      await this.favoriteRepository.save(favoriteList);
      
      return {
        message: 'Added to favorite list successfully',
      }
      
    } catch (error) {
      CommonException.handle(error)
    }
  }
  async removeFavoriteList(id: string, accountId: string) : Promise<{message: string}> {
    try {
      const favoriteList = await this.favoriteRepository.createQueryBuilder('favoriteList')
      .where('favoriteList.id = :id', {id})
      .andWhere('favoriteList.accountId = :accountId',{accountId})
      .getOne();
      
      if (!favoriteList) {
        throw new BadRequestException('Favorite list not found');
      }
      
      this.favoriteRepository.remove(favoriteList);
      return {
        message: 'Removed from favorite list successfully',
      }
    } catch (error) {
      CommonException.handle(error)
    }
  }
  

}
