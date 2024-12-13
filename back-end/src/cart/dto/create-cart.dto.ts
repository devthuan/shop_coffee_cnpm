import { IsNumber, IsString, Min } from "class-validator";

export class CreateCartDto {
    @IsString()
    ProductAttributesId: string;
    
    @IsNumber()
    @Min(1)
    quantity: number;
    
    accountsId: string;
   
    
   
}

