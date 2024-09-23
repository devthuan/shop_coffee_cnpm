import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, minLength, MinLength } from "class-validator";


export class DeleteRoleDto {

    @IsString()
    nameCode: string;

   


}
