import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, Min, Validate } from "class-validator";


import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments) {
        const startDate = (args.object as any)[args.constraints[0]];
        return endDate > startDate; // Check if endDate is after startDate
    }

    defaultMessage(args: ValidationArguments) {
        return `endDate must be after startDate`;
    }
}




export class CreateVoucherDto {
    @IsString()
    code: string;

    @IsString()
    name: string;

    @IsNumber()
    @Min(1)
    value: number;

    @Min(1)
    @IsNumber()
    quantity: number;

    @IsString()
    description: string;

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    @Validate(IsEndDateAfterStartDate, ['startDate'])
    endDate: Date;

    status: string;
}
