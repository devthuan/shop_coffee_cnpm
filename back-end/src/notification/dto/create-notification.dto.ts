import { Optional } from "@nestjs/common";
import { IsIn, IsOptional, IsString } from "class-validator";


export class CreateNotificationDto {


    @IsIn(['all','user','role'])
    typeSend: string;

    @IsOptional()
    userId: string;

    @IsOptional()
    roleId: string;
    
    @IsString()
    title: string;

    @IsString()
    content: string;


    accountId: string
    
}
