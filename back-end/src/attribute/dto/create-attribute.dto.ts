import { IsString } from "class-validator";

export class CreateAttributeDto {
    
    @IsString()
    code: string;
    
    @IsString()
    name: string;
    
    @IsString()
    description: string;
}
