import { Test, TestingModule } from '@nestjs/testing';
import { SubAttributeController } from './sub-attribute.controller';
import { SubAttributeService } from './sub-attribute.service';

describe('SubAttributeController', () => {
  let controller: SubAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAttributeController],
      providers: [SubAttributeService],
    }).compile();

    controller = module.get<SubAttributeController>(SubAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
