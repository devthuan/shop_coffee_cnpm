import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { plainToInstance } from 'class-transformer';
import { Favorite } from './entities/favorite.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('favorite')
@UseGuards(AuthGuardCustom)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_FAVORITE")
  @Post()
  create(@Req() request: Request,@Body() createFavoriteDto: CreateFavoriteDto) {
    createFavoriteDto.accountId = request['user'].id;
    return this.favoriteService.addFavoriteList(createFavoriteDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_FAVORITES")
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    limit = limit > 100? 100 : limit;
    let data =  this.favoriteService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Favorite, data);
    }

    @UseGuards(PermissionsGuard)
  // @Permissions("GET_FAVORITES_BY_USER") 
  @Get('user')
  getListFavoriteByAccount(
    @Req() request: Request,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const {search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    let accountId = request['user'].id;
    let data =  this.favoriteService.getListFavoriteByAccount(accountId, search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Favorite, data);
    }
  
  //   @UseGuards(PermissionsGuard)
  // @Permissions("DELETE_FAVORITE_BY_ID") 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
  //   return this.favoriteService.update(id, updateFavoriteDto);
  // }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_FAVORITE_BY_ID") 
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    let accountId = request['user'].id
    return this.favoriteService.removeFavoriteList(id, accountId);
  }
}
