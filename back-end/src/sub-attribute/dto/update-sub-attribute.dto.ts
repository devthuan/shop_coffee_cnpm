import { PartialType } from '@nestjs/mapped-types';
import { CreateSubAttributeDto } from './create-sub-attribute.dto';

export class UpdateSubAttributeDto extends PartialType(CreateSubAttributeDto) {}
