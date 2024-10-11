import { IsString } from "class-validator";


export class CreateNotificationDto {
    
    @IsString()
    title: string;

    @IsString()
    content: string;
    
}
