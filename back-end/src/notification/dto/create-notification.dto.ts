import { Optional } from "@nestjs/common";
import { IsEmail, IsIn, IsOptional, IsString, Min, MinLength } from "class-validator";


export class CreateNotificationDto {


    @IsIn(['all','user','role'])
    typeSend: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    roleId: string;
    
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(5)
    content: string;


    accountId: string
    
}
