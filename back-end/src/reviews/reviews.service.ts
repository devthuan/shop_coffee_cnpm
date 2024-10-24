import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './entities/review.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/baseService';
import { CommonException } from 'src/common/exception';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Products } from 'src/product/entities/products.entity';

@Injectable()
export class ReviewsService extends BaseService<Reviews> {
 constructor(
  @InjectRepository(Reviews)
  private readonly reviewRepository: Repository<Reviews>, // Inject repository for any entity Reviews
  @InjectRepository(Accounts)
  private readonly accountRepository: Repository<Accounts>, // Inject repository for any entity Reviews
  @InjectRepository(Products)
  private readonly productRepository: Repository<Products>, // Inject repository for any entity Reviews
 ){
  super(reviewRepository);
 }  

 async create(createReview: CreateReviewDto) : Promise<Reviews> {
  try {
    const accounts = await this.accountRepository.createQueryBuilder('accounts')
    .leftJoinAndSelect('accounts.bills', 'bills')
    .leftJoinAndSelect('bills.billDetails', 'billDetails')
    .leftJoinAndSelect('billDetails.productAttributes', 'productAttributes')
    .leftJoinAndSelect('productAttributes.products', 'products')
    .where('accounts.id = :id', {id: createReview.accountId})
    .andWhere('accounts.deletedAt IS NULL')
    .getOne();
  
    if (!accounts || !accounts.isActive){
      throw new NotFoundException('Account not found or blocked');
    }

    let hasBoughtProduct = false;
    // Check if the account bought the product before
    for (let bill of accounts.bills) {
      for (let detail of bill.billDetails) {
          if(detail.productAttributes.products.id === createReview.productsId){
             hasBoughtProduct = true;
              break;

          }
       
      }
    }
  
  if (!hasBoughtProduct) {
    throw new BadRequestException('Account has not bought this product');
  }
    const products = await this.productRepository.createQueryBuilder('products')
     .where('products.id = :id', {id: createReview.productsId})
     .andWhere('products.deletedAt IS NULL')
     .getOne();
      
    if (!products)   throw new NotFoundException('Product not found');

    const review = this.reviewRepository.create(createReview);
    review.accounts = accounts;
    review.products = products;
    return await this.reviewRepository.save(review);
  

  } catch (error) {
    CommonException.handle(error)
  }
 }


 async findAllByProduct(
  productId: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
 ) : Promise<{total: number;  currentPage: number; totalPage: number; limit : number; data: Products[]}> {
    try{
      const queryBuilder = this.productRepository.createQueryBuilder('products')
        .leftJoinAndSelect('products.reviews', 'reviews')
        .innerJoinAndSelect('reviews.accounts', 'accounts')
        .where('products.id = :id', {id: productId})
        .andWhere('products.deletedAt IS NULL')
        .andWhere('reviews.deletedAt IS NULL')
        
        const [products, total] = await queryBuilder
        .skip( (page -1 ) * limit)
        .take(limit)
        .orderBy(`products.${sortBy}`, sortOrder)
        .getManyAndCount();
    
        return {
          total,
          currentPage: page,
          totalPage: Math.ceil(total / limit),
          limit,
          data: products
        }

    }catch(error){
      CommonException.handle(error)
    }
 }

}
