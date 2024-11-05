import { IsNumber, IsString, Max, Min } from "class-validator";


export class CreateReviewDto {

    @IsString()
    productsId: string;


    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    comment: string;

    accountId: string;


   

}
