import { Injectable } from '@nestjs/common';
import { Payments } from './entities/payment.entity';
import { BaseService } from 'src/common/baseService';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import axios from 'axios';
import * as moment from 'moment';

@Injectable()
export class PaymentService extends BaseService<Payments> {

  private vnpUrl = process.env.VNPAY_URL;
  private returnUrl = process.env.VNPAY_RETURNURL; // URL callback
  private vnpTmnCode = process.env.VNPAY_TMNCODE ;
  private vnpHashSecret = process.env.VNPAY_HASHSECRET;

  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>, 
  ) {
    super(paymentRepository);
  }

 

  createPaymentUrl(orderId: string, amount: number): string {
     process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
  
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = this.vnpTmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = moment(date).format("DDHHmmss");;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = this.returnUrl;
    vnp_Params["vnp_IpAddr"] = "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;
    // vnp_Params["vnp_BankCode"] = "VNPAYQR";
   

    vnp_Params = this.sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", this.vnpHashSecret);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    let dataURL = this.vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

    return dataURL;
  }

  async handleIpn(vnp_Params: any): Promise<any> {
    
      let secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = this.sortObject(vnp_Params);

      // let tmnCode = config.get('vnp_TmnCode');
      let secretKey = this.vnpHashSecret

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");     
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

      if(secureHash === signed){
          //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

          return {
            message: "success",
            code: vnp_Params['vnp_ResponseCode']
          }
      } else{
        return {
            message: "Fail checksum",
            code: "97"
          }
      }
    }

  //  async handleReturn(vnp_Params: any): Promise<any> {
  //       const secureHash = vnp_Params['vnp_SecureHash'];
        
  //       delete vnp_Params['vnp_SecureHash'];
  //       delete vnp_Params['vnp_SecureHashType'];

  //       const sortedParams = this.sortObject(vnp_Params);
  //       const secretKey = this.vnpHashSecret
  //       const signData = querystring.stringify(sortedParams);

  //       const hmac = crypto.createHmac('sha512', secretKey);
  //       const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  //       if (secureHash === signed) {
  //           // Kiểm tra dữ liệu trong DB có hợp lệ không
  //           return { code: vnp_Params['vnp_ResponseCode'], isValid: true };
  //       } else {
  //           return { code: '97', isValid: false };
  //       }
  //   }

  sortObject(obj: any): any {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}


}
