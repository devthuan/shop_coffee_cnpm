import { Module } from '@nestjs/common';
import { SubAttributeService } from './sub-attribute.service';
import { SubAttributeController } from './sub-attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubAttributes } from './entities/sub-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubAttributes])
  ],
  controllers: [SubAttributeController],
  providers: [SubAttributeService],
  exports: [SubAttributeService]
})
export class SubAttributeModule {}
