import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAccountDto   {
     id: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    userName: string;

    @IsString()
    role: string;
}
