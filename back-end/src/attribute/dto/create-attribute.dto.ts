import { IsString } from "class-validator";

export class CreateAttributeDto {
    
    @IsString()
    name: string;
    
    @IsString()
    description: string;
}
