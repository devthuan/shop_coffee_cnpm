import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";



export class BillDetailDto {
    @IsString()
    productAttributeId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
 
}


export class CreateBillDto {
    

    @IsOptional()
    voucher: string;
    
    totalPrice: number;

    status: string = 'pending';

    @IsString()
    fullName: string;

    @IsString()
    deliveryAddress: string;
    
    @IsString()
    deliveryPhone: string;

    @IsString()
    shippingMethod: string;

    @IsString()
    paymentMethod: string;

    @IsOptional()
    note: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => BillDetailDto)
    products: BillDetailDto[]


}
