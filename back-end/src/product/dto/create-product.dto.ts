import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";


export class SubAttributeDto{
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    quantity: number;

 
}

export class AttributeDto {
    @IsString()
    attributesId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubAttributeDto)
    subAttribute: SubAttributeDto[];

}


export class CreateProductDto {
    
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    categoryId: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeDto)
    attributes: AttributeDto[];

}
