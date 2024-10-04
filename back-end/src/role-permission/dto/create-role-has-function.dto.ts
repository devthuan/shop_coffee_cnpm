import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, minLength, MinLength } from "class-validator";


export class createRoleHasFunctions {

    @IsString()
    codeNameRole: string;

    @IsString()
    codeNameFunction: string


}
