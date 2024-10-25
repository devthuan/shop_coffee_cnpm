import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator";

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

    
}
