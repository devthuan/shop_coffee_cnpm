import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { plainToInstance } from 'class-transformer';
import { Cart } from './entities/cart.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() req: Request,
    @Body() createCartDto: CreateCartDto) {
      createCartDto.accountsId = req['user'].id

  
    return this.cartService.createCart(createCartDto);
  }
  
  @UseGuards(AuthGuard)
  @Patch('increase/:id')
  increaseQuantity(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    let accountsId = req['user'].id
    return this.cartService.increaseQuantity(id, accountsId);
  }

  @UseGuards(AuthGuard)
  @Patch('decrease/:id')
  decreaseQuantity(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
      let accountsId = req['user'].id
    return this.cartService.decreaseQuantity(id, accountsId);
  }


  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Req() req: Request,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: "ASC" | "DESC" = "DESC",
  ) {
    limit = limit > 100 ? 100 : limit ;
    let accountId = req['user'].id
    let data = this.cartService.findAll(search, page, limit, sortBy, sortOrder, accountId);
    return plainToInstance(Cart, data)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartService.findOne(id);
  // }
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string, 
    @Body() updateCartDto: UpdateCartDto
  ) {
    updateCartDto.accountsId = req['user'].id
    return this.cartService.updateQuantity(id, updateCartDto);
  }
  
  @UseGuards(AuthGuard)

  @Delete(':id')
  deleteSoft(@Param('id') id: string, @Req() req: Request) {
    let accountsId = req['user'].id
    return this.cartService.removeCart(id, accountsId);
  }
}
