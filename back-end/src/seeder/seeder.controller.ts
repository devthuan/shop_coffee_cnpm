import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('role')
  seedingRoleAndFunction(){
    return this.seederService.createRoleAndPermission()
  }
  @Post('permission')
  createRoleHasFunction(){
    return this.seederService.createRoleHasFunction()
  }
  @Post('init-data')
  initData(){
    return this.seederService.initData()
  }

}
