import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, Min } from "class-validator";


export class CreateDiscountDto {
    @IsString()
    name: string

    @IsString()
    code: string

    @IsNumber()
    @Min(1)
    quantity: number

    @IsNumber()
    value: number

    @IsDate()
    @Type(() => Date)
    startDate: Date

    @IsDate()
    @Type(() => Date)
    endDate: Date

    @IsString()
    productId: string
    
}
