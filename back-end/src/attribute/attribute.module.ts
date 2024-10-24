import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attributes } from './entities/attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attributes]), 
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService]
})
export class AttributeModule {}
