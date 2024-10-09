import { PartialType } from '@nestjs/mapped-types';
import { CreateBillDto } from './create-bill.dto';
import { IsIn } from 'class-validator';

export class UpdateBillDto extends PartialType(CreateBillDto) {}


export class UpdateStatusDto {
    @IsIn(['pending', 'delivery', 'success', 'failed', 'cancelled'])
    status: string ;
}