import { IsNumber, IsString, Max, Min } from "class-validator";


export class ReplyReviewDto {

  

    @IsString()
    comment: string;

    accountId: string; 

    @IsString()
    parentId: string; // ID của bình luận cha, nếu là trả lời
   

}
