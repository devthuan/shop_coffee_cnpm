import { Optional } from "@nestjs/common";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";


export class ImportReceiptDetailDto {
    @IsString()
    productAttributeId: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateImportReceiptDto {
    
    @Optional()
    @IsString()
    note: string = "";

    totalAmount: number

    status: string

    accountId: string

    @IsString()
    supplierId: string

    @ArrayNotEmpty({ message: 'Import receipt details must contain at least one item.' })
    @ValidateNested({ each: true })
    @Type(() => ImportReceiptDetailDto)
    importReceiptDetails: ImportReceiptDetailDto[];
}


