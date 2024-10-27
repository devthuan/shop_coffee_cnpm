import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsPhoneNumber, IsString, Min } from "class-validator";

export class CreateSupplierDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string; 

    @IsString()
    @IsPhoneNumber()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    description: string;

    @IsString()
    logo: string;

    @IsString()
    website: string;

    @IsString()
    bankAccountNumber: string;

    @IsString()
    bankName: string;

    @IsString()
    bankAddress: string;

    @IsArray()
    @Type(()=> DetailSupplier)
    detailSuppliers: DetailSupplier[];
    
}

class DetailSupplier {
    @IsNumber()
    @Min(0)
    price: number;

    supplierId: string;

    @IsString()
    productAttributeId: string;

}


export class CreateDetailSupplier {
     
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    supplierId: string;

    @IsString()
    productAttributeId: string;


}