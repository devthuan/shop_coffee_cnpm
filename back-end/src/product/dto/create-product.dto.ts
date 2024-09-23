import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";


export class AttributeValues {
    @IsString()
    value: string;

}


export class CreateProductDto {
    
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    price: string;

    @IsString()
    category: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeValues)
    attributes: AttributeValues[];

}
