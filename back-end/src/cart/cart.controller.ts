import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { plainToInstance } from 'class-transformer';
import { Cart } from './entities/cart.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Permissions } from 'src/auth/permission.decorator';

@Controller('cart')
@UseGuards(AuthGuardCustom)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_CART")
  @Post()
  create(
    @Req() req: Request,
    @Body() createCartDto: CreateCartDto) {
      createCartDto.accountsId = req['user'].id

  
    return this.cartService.createCart(createCartDto);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("INCREASE_CART_PRODUCT")
  @Patch('increase/:id')
  increaseQuantity(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    let accountsId = req['user'].id
    return this.cartService.increaseQuantity(id, accountsId);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DECREASE_CART_PRODUCT")
  @Patch('decrease/:id')
  decreaseQuantity(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
      let accountsId = req['user'].id
    return this.cartService.decreaseQuantity(id, accountsId);
  }


  @UseGuards(PermissionsGuard)
  @Permissions("GET_CART")
  @Get()
  findAll(
    @Req() req: Request,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: "ASC" | "DESC" = "DESC",
    @Query() query: Record<string, any>

  ) {

    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;

    limit = limit > 100 ? 100 : limit ;
    let accountId = req['user'].id
    let data = this.cartService.findAll(search, page, limit, sortBy, sortOrder, accountId,filters);
    return plainToInstance(Cart, data)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(id);
  // }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_CART_PRODUCT")
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string, 
    @Body() updateCartDto: UpdateCartDto
  ) {
    updateCartDto.accountsId = req['user'].id
    return this.cartService.updateQuantity(id, updateCartDto);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_CART_PRODUCT")
  @Delete(':id')
  deleteSoft(@Param('id') id: string, @Req() req: Request) {
    let accountsId = req['user'].id
    return this.cartService.removeCart(id, accountsId);
  }
}
