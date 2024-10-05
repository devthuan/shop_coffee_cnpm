import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class AttributeDto {
    @IsString()
    attributeId: string;

}


export class UpdateProductDto   {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    categoryId: string;

    @IsOptional()
    @IsArray()
    images: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeDto)
    attributes: AttributeDto[];

}
