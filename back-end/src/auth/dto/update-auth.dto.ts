import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './register.dto';
import { IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateAuthDto  {

    id: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    userName: string;

    @IsString()
    role: string;
    
}
