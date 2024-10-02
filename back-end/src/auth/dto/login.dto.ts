import { IsEmail, IsIP, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreateAuthDto {
   
    // @IsEmail()
    // email: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsIP()
    ip: string;

 

    
}
