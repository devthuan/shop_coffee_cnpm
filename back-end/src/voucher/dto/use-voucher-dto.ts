import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";


export class UseVoucherDto {
    @IsString()
    voucherId: string;

    accountId: string

}