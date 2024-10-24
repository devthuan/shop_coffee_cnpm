import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { plainToInstance } from 'class-transformer';
import { Reviews } from './entities/review.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("CREATE_REVIEW")
  @Post()
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    createReviewDto.accountId = req.user.id
    const data = this.reviewsService.create(createReviewDto);
    return plainToInstance(Reviews, data)
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>
  ) {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit = limit > 100 ? 100 : limit;
    const data = this.reviewsService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Reviews, data)
  }
  @Get('by-product/:id')
  findAllByProduct(
    @Param('id') productId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    limit > 100 ? limit = 100 : limit;
    const data = this.reviewsService.findAllByProduct(productId, page, limit, sortBy, sortOrder);
    return plainToInstance(Reviews, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("UPDATE_REVIEW")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("DELETE_REVIEW")
  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.reviewsService.deleteSoft(id);
  }
}
