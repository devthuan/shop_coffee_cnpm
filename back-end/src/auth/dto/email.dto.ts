import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class EmailDto {
    @IsEmail()
    email: string;

    

    
}
