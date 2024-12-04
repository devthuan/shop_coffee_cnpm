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
import * as crypto from 'crypto';

@Controller('payment')

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("CREATE_PAYMENT_METHOD")
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  // @UseGuards(PermissionsGuard)
  // @UseGuards(AuthGuardCustom)
  // @Permissions("GET_PAYMENT_METHOD")
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

  @UseGuards(AuthGuardCustom)
  @Get('vnpay/create_payment_url')
  createPaymentUrl(@Query('orderId') orderId: string, @Query('amount') amount: number, @Res() res: Response) {
    const paymentUrl = this.paymentService.createPaymentUrl(orderId, amount);
    console.log(paymentUrl)
   return res.status(200).json({ paymentUrl });
  }

  @Get('vnpay/vnpay_ipn')
  async handleIpn(@Query() vnp_Params: any, @Res() res: Response) {
    const { vnp_PayDate, vnp_TransactionNo, vnp_Amount, vnp_ResponseCode } = vnp_Params;
    console.log(vnp_Params)
    const result = await this.paymentService.handleIpn(vnp_Params);
    console.log(result)
       // Kiểm tra chữ ký và xử lý logic (đã đề cập ở trên)
      const status = vnp_ResponseCode === '00' ? 'success' : 'failed';

          // Redirect về FE với trạng thái thanh toán
      const frontendUrl = `${process.env.FRONTEND_URL}/payment-result?orderId=${vnp_TransactionNo}&status=${status}&amount=${vnp_Amount.slice(0,-2)}&date=${vnp_PayDate}`;
      return res.redirect(frontendUrl);


    
      // res.status(200).json(result);
  }
//   {
//   vnp_Amount: '7000000',
//   vnp_BankCode: 'NCB',
//   vnp_BankTranNo: 'VNP14680890',
//   vnp_CardType: 'ATM',
//   vnp_OrderInfo: 'Thanh toan cho ma GD:undefined',
//   vnp_PayDate: '20241118221413',
//   vnp_ResponseCode: '00',
//   vnp_TmnCode: 'LKYXUXPD',
//   vnp_TransactionNo: '14680890',
//   vnp_TransactionStatus: '00',
//   vnp_TxnRef: '18221402',
//   vnp_SecureHash: 'bde5ec7c0da4465a3ca996381041797ea4b0848ee6011557e4694c05d0c82f77eabc537d9a8b9fc885a3768df8cff7ebfa410c9d005f5f9285e277c29a721f66'
// }

   @Get('momo')
   vnpayReturn() {
    return  this.paymentService.momoPayment();
  }

  

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("GET_PAYMENT_METHOD_BY_ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  } 

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("UPDATE_PAYMENT_METHOD")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("RECOVER_PAYMENT_METHOD")
  @Patch('recover/:id')
  recover(@Param('id') id: string) {
    return this.paymentService.recover(id);
  }

  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuardCustom)
  @Permissions("DELETE_PAYMENT_METHOD")
  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.paymentService.deleteSoft(id);
  }


 
}
