import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";


export class CreateAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(12)
    confirmPassword: string;


    @IsOptional()
    role: string;

    
}
