import { Module } from '@nestjs/common';
import { FunctionService } from './function.service';
import { FunctionController } from './function.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Functions } from './entities/functions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Functions])
  ],
  controllers: [FunctionController],
  providers: [FunctionService],
  exports: [FunctionService],  // Make FunctionService available to other modules
})
export class FunctionModule {}
