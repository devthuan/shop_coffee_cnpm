import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { BaseService } from 'src/common/baseService';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommonException } from 'src/common/exception';
import { Products } from 'src/product/entities/products.entity';
import { NotFoundError } from 'rxjs';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';

@Injectable()
export class CartService  {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,

    
    @InjectRepository(Accounts)
    private readonly AccountsRepository: Repository<Accounts>,
    
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,


    private readonly dataSource : DataSource
  ){
  }


  async createCart(createCartDto: CreateCartDto): Promise<{message: string}> {
    try {

      const checkAccount = await this.AccountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: createCartDto.accountsId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
      if (!checkAccount){
        throw new NotFoundException('Account not found')
      }     
      const checkProductAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .where('productAttributes.id = :id', {id: createCartDto.ProductAttributesId})
        .andWhere('productAttributes.deletedAt is null')
        .getOne();
      if(!checkProductAttribute){
       throw new NotFoundException('Product not found')
      }

      // check quantity attribute
      if(checkProductAttribute.quantity < createCartDto.quantity){
        throw new NotFoundException('Quantity attribute not enough')
      }

      const checkCart = await this.cartRepository.createQueryBuilder('cart')
        .where('cart.deletedAt is null')
        .andWhere('cart.accountsId = :accountsId', {accountsId: checkAccount.id})
        .andWhere('cart.productAttributes = :productAttributes', {productAttributes: checkProductAttribute.id})
        .getOne();
        
      if(checkCart){
        checkCart.quantity += createCartDto.quantity;
        await this.cartRepository.save(checkCart);
        return {
          message: 'Cart updated successfully'
        };
      } 


      const newCart =  this.cartRepository.create({
        accounts: checkAccount,
        quantity: createCartDto.quantity,
        productAttributes: checkProductAttribute
      })

      await this.cartRepository.save(newCart);

      
      return {
        message: 'Cart created successfully'
      };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async increaseQuantity(idCart: string, accountsId: string): Promise<{message: string}> {
    try {

      const checkAccount = await this.AccountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: accountsId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
      if (!checkAccount){
        throw new NotFoundException('Account not found')
      }   
      
      const checkCart = await this.cartRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
        .where('cart.deletedAt is null')
        .andWhere('cart.id = :id', {id: idCart})
        .getOne();
        
      if(!checkCart){
        throw new NotFoundException('Cart not found')
      }

      const checkProductAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .where('productAttributes.id = :id', {id: checkCart.productAttributes ? checkCart.productAttributes.id : null})
        .andWhere('productAttributes.deletedAt is null')
        .getOne();
        
      if(!checkProductAttribute){
       throw new NotFoundException('Product not found')
      }

      // check quantity attribute
     if(checkProductAttribute.quantity < 1){
        throw new NotFoundException('Quantity not enough')
      }

      checkCart.quantity += 1;
      await this.cartRepository.save(checkCart);
  
      return {
        message: 'Cart updated quantity successfully'
      };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }

  async decreaseQuantity(idCart: string, accountsId: string): Promise<{message: string}> {
    try {

      const checkAccount = await this.AccountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: accountsId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
      if (!checkAccount){
        throw new NotFoundException('Account not found')
      }   
      
      const checkCart = await this.cartRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
        .where('cart.deletedAt is null')
        .andWhere('cart.id = :id', {id: idCart})
        .getOne();
        
      if(!checkCart){
        throw new NotFoundException('Cart not found') 
      }

      const checkProductAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .where('productAttributes.id = :id', {id: checkCart.productAttributes.id})
        .andWhere('productAttributes.deletedAt is null')
        .getOne();

      if(!checkProductAttribute){
       throw new NotFoundException('Product not found')
      }

      // check quantity attribute
     if(checkCart.quantity - 1 <= 0){
        throw new NotFoundException('Quantity attribute not enough')
      }

      checkCart.quantity -= 1;
      await this.cartRepository.save(checkCart);
  
      return {
        message: 'Cart updated quantity successfully'
      };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }

  
  async updateQuantity(idCart: string, updateCartDto: UpdateCartDto): Promise<{message: string}> {
    try {

      const checkAccount = await this.AccountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: updateCartDto.accountsId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
      if (!checkAccount){
        throw new NotFoundException('Account not found')
      }   
      
      const checkCart = await this.cartRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
        .where('cart.deletedAt is null')
        .andWhere('cart.id = :id', {id: idCart})
        .getOne();
        
      if(!checkCart){
        throw new NotFoundException('Cart not found') 
      }

      const checkProductAttribute = await this.productAttributesRepository.createQueryBuilder('productAttributes')
        .where('productAttributes.id = :id', {id: checkCart.productAttributes.id})
        .andWhere('productAttributes.deletedAt is null')
        .getOne();

      if(!checkProductAttribute){
       throw new NotFoundException('Product not found')
      }

      // check quantity attribute
     if(checkProductAttribute.quantity < updateCartDto.quantity){
        throw new NotFoundException('Quantity not enough')
      }

      checkCart.quantity = updateCartDto.quantity;
      await this.cartRepository.save(checkCart);
  
      return {
        message: 'Cart updated quantity successfully'
      };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }


  async findAll(
    search: string,
    page: number,
    limit: number,
    sortBy : string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    accountId: string,
    filters: Record<string, any> = {} // Nhận filters từ controller
  ): Promise<{ message: string; total: number;  currentPage: number; totalPage: number; limit : number; data: Cart[]}> {
    try {
      const queryBuilder = this.cartRepository.createQueryBuilder('cart')
       .where('cart.deletedAt is null')
       .andWhere('cart.accounts.id = :accountId', {accountId: accountId})
       .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
       .leftJoinAndSelect('productAttributes.products', 'products')
       .leftJoinAndSelect('products.category', 'category')
       .leftJoinAndSelect('productAttributes.attributes', 'attributes')
       .leftJoinAndSelect('products.images', 'images')
       .leftJoinAndSelect('products.productDiscount', 'productDiscount');
       
        if (search) {
            queryBuilder.andWhere('products.name LIKE :search', { search: `%${search}%` });
          }

        // Filter conditions
          Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined && filters[key] !== null) {
              let value = filters[key];
              
              // Chuyển đổi giá trị 'true' hoặc 'false' thành boolean
              if (value === 'true') value = true;
              if (value === 'false') value = false;

              queryBuilder.andWhere(`cart.${key} = :${key}`, { [key]: value });
            }
          });

          // count total
          const total = await queryBuilder.getCount();

         // pagination page
          const data = await queryBuilder
            .skip((page - 1) * limit) // Bỏ qua các bản ghi đã được hiển thị
            .take(limit) // Giới hạn số bản ghi trả về
            .orderBy(`cart.${sortBy}`, sortOrder) // Sắp xếp theo trường chỉ định
            .getMany(); // Lấy danh sách bản ghi


      const totalPage = Math.ceil(total / limit);
       return {
        message: 'List of cart data',
        total,
        totalPage,
        currentPage: +page,
        limit: +limit,
        data
       };
       } catch (error) {
      CommonException.handle(error);
       }
  }

  async removeCart(idCart: string, accountsId: string): Promise<{message: string}> {
    try {

      const checkAccount = await this.AccountsRepository.createQueryBuilder('accounts')
        .where('accounts.id = :id', {id: accountsId})
        .andWhere('accounts.deletedAt is null')
        .andWhere('accounts.isActive = :isActive', {isActive: true})
        .getOne();
      if (!checkAccount){
        throw new NotFoundException('Account not found')
      }   
      
      const checkCart = await this.cartRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
        .where('cart.deletedAt is null')
        .andWhere('cart.id = :id', {id: idCart})
        .getOne();
        
      if(!checkCart){
        throw new NotFoundException('Cart not found') 
      }

      await this.cartRepository.remove(checkCart);
  
      return {
        message: 'Cart deleted successfully'
      };
      
    } catch (error) {
      CommonException.handle(error);
    }
  }

   async getProductByAccountIdAndProductAttributeId(accountId: string, productAttributeId: string): Promise<Cart> {
    try {
      const result = await this.cartRepository.createQueryBuilder('cart')
        .leftJoinAndSelect('cart.productAttributes', 'productAttributes')
        .where('cart.accounts.id = :accountId', { accountId })
        .andWhere('productAttributes.id = :productAttributeId', { productAttributeId })
        .andWhere('cart.deletedAt is null')
        .getOne();
        
      return result;
  

    } catch (error) {
      CommonException.handle(error)
    }
  }

 



}
