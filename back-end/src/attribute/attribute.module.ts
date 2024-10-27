import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attributes } from './entities/attributes.entity';
import { PermissionsGuard } from 'src/auth/permisson.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attributes]), 
    AuthModule
  ],
  controllers: [AttributeController],
  providers: [AttributeService,PermissionsGuard ],
  exports: [AttributeService]
})
export class AttributeModule {}
