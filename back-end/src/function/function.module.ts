import { Module } from '@nestjs/common';
import { FunctionService } from './function.service';
import { FunctionController } from './function.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Functions } from './entities/functions.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Functions]),
    AuthModule
  ],
  controllers: [FunctionController],
  providers: [FunctionService],
  exports: [FunctionService],  // Make FunctionService available to other modules
})
export class FunctionModule {}
