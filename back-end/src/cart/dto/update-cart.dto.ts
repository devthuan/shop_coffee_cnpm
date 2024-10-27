import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartDto {
    accountsId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}
