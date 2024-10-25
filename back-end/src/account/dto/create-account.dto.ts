import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccountDto {
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


    @IsString()
    role: string;

}
