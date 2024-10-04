import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, minLength, MinLength } from "class-validator";


export class CreateRoleDto {

    @IsString()
    name: string;

    @IsString()
    codeName: string;

    @IsString()
    guardName: string;


}
