import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributes } from 'src/product/entities/productAttributes.entity';
import { Repository } from 'typeorm';
import { Attributes } from 'src/attribute/entities/attributes.entity';
import { Images } from 'src/product/entities/images.entity';
import { CommonException } from 'src/common/exception';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,  // inject repository here
    @InjectRepository(Attributes)
    private readonly attributesRepository: Repository<Attributes>,  // inject repository here
    @InjectRepository(Images)
    private readonly imagesRepository: Repository<Images>,  // inject repository here
  ) { }


  create(createInventoryDto: CreateInventoryDto) {
    return 'This action adds a new inventory';
  }

  async findAll(
  search: string,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
): Promise<{
  message: string;
  total: number;
  currentPage: number;
  totalPage: number;
  limit: number;
  data: ProductAttributes[];
}> {
  try {
    const queryBuilder = this.productAttributesRepository.createQueryBuilder('productAttributes')
      .leftJoinAndSelect('productAttributes.attributes', 'attributes')
      .leftJoinAndSelect('productAttributes.products', 'products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.images', 'images')
      .where('productAttributes.deletedAt IS NULL');

    if (search) {
      queryBuilder.andWhere('attributes.name LIKE :search OR products.name LIKE :search', { search: `%${search}%` });
    }

    // Ensuring valid sortBy and sortOrder
    const allowedSortFields = ['createdAt', 'updatedAt', 'name']; // Add valid fields here
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'createdAt'; // Fallback to default if invalid
    }

    queryBuilder.orderBy(`productAttributes.${sortBy}`, sortOrder);
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    const [result, total] = await queryBuilder.getManyAndCount();
    const totalPage = Math.ceil(total / limit);

    return {
      message: 'get successfully',
      total,
      currentPage: page,
      totalPage,
      limit,
      data: result,
    };
  } catch (error) {
    CommonException.handle(error);
  }
}


  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
