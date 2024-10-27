import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { plainToInstance } from 'class-transformer';
import { Payments } from './entities/payment.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { Request, Response } from 'express';

@Controller('payment')
@UseGuards(AuthGuardCustom)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_PAYMENT_METHOD")
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_PAYMENT_METHOD")
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const { search : _search, page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit > 100? limit = 100 : limit;
    let data = this.paymentService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Payments, data)
  }

  @Get('/vnpay/create_payment_url')
  createPaymentUrl(@Query('orderId') orderId: string, @Query('amount') amount: number, @Res() res: Response) {
    const paymentUrl = this.paymentService.createPaymentUrl(orderId, amount);
    console.log(paymentUrl)
    return res.redirect(paymentUrl);
  }

  @Get('vnpay/vnpay_ipn')
  async handleIpn(@Query() vnp_Params: any, @Res() res: Response) {
      const result = await this.paymentService.handleIpn(vnp_Params);
      res.status(200).json(result);
  }

  //  @Get('vnpay/vnpay_return')
  // async vnpayReturn(@Req() req: Request, @Res() res: Response) {
  //   const message = await this.paymentService.handleReturn(req.query);
  //   return res.send(message);
  // }

  

  @UseGuards(PermissionsGuard)
  @Permissions("GET_PAYMENT_METHOD_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  } 

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_PAYMENT_METHOD")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }
  
  @UseGuards(PermissionsGuard)
  @Permissions("RECOVER_PAYMENT_METHOD")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.paymentService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_PAYMENT_METHOD")
  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.paymentService.deleteSoft(id);
  }


 
}
