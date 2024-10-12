import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class CreateUserInformationDto {

    @IsString()
    @IsNotEmpty()
    fullName: string;
    
    @IsPhoneNumber()
    phoneNumber: string;
   
    // @IsEmail()
    // email: string;
    
    @IsString()
    @IsNotEmpty()
    avatar: string;
    
    @IsDate()
    @Type(() => Date)
    birthDate: Date;
    
    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    address1: string;

    @IsString()
    @IsNotEmpty()
    address2: string;


}
