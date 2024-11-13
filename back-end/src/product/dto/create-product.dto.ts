import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";



export class AttributeDto {
    @IsString()
    attributeId: string;
    
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

    @IsArray()
    images: string[];

}
