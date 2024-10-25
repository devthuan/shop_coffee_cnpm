import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";




export class CreateProductAttributeDto {
    
    @IsString()
    attributeId: string;

    @IsString()
    productId: string;


}
