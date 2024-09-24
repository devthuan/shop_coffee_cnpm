import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

export class GetAttributesDto {
    
    id: string;

    @IsString()
    code: string;
    
    @IsString()
    name: string;
    
    @IsString()
    description: string;


    createdAt: Date;

   
    updatedAt: Date;

    @Exclude()
    deletedAt: Date;


}
