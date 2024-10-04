import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './entities/review.entity';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Products } from 'src/product/entities/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reviews, Accounts, Products])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
