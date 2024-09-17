import { IsEmail, IsIP, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";


export class LoginDto {
   
    @ValidateIf(o => !o.username)  // Nếu không có username thì email là bắt buộc
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ValidateIf(o => !o.email)     // Nếu không có email thì username là bắt buộc
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsIP()
    @IsString()
    ip: string;


    
}
