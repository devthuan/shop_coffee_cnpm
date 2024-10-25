import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, minLength, MinLength } from "class-validator";


export class ChangePasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    oldPassword: string;

    @IsString()
    @MinLength(6)
    newPassword: string
    
    @IsString()
    @MinLength(6)
    newPasswordConfirm: string


}
