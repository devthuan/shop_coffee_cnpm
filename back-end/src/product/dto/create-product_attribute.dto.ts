import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Attributes } from "../entities/attributes.entity";




export class CreateProductAttributeDto {
    
    @IsString()
    attributeId: string;

    @IsString()
    productId: string;


}
