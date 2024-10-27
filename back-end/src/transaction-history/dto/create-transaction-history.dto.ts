import { IsNumber, IsString } from "class-validator";

export class CreateTransactionHistoryDto {

    @IsString()
    typeTransaction: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    balanceBefore: number;

    @IsNumber()
    balanceAfter: number;

    @IsString()
    description: string;

    status: string = 'success';

    accountId: string;
}
