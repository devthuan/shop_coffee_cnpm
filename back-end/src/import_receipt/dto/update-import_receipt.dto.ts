import { PartialType } from '@nestjs/mapped-types';
import { CreateImportReceiptDto } from './create-import_receipt.dto';
import { IsIn } from 'class-validator';

export class UpdateImportReceiptDto extends PartialType(CreateImportReceiptDto) {}


export class StatusImportReceiptDto {
    @IsIn(['pending', 'approved', 'rejected'])
    status: string;

    accountId: string;

}