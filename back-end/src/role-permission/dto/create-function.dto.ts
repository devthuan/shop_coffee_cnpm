import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, minLength, MinLength } from "class-validator";


export class CreateFunctionDto {

    @IsString()
    name: string;

    @IsString()
    codeName: string;

    @IsString()
    guardName: string;

    @IsString()
    method: string;

    @IsString()
    endpoint: string;

    @IsString()
    description: string;


}
