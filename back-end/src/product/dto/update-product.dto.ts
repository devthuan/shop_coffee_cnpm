import { PartialType } from '@nestjs/mapped-types';
import { AttributeDto, CreateProductDto } from './create-product.dto';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto   {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AttributeDto)
    attributes: AttributeDto[];

}
