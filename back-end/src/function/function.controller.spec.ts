import { Test, TestingModule } from '@nestjs/testing';
import { FunctionController } from './function.controller';
import { FunctionService } from './function.service';

describe('FunctionController', () => {
  let controller: FunctionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunctionController],
      providers: [FunctionService],
    }).compile();

    controller = module.get<FunctionController>(FunctionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
