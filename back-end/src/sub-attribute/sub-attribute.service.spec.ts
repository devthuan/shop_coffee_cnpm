import { Test, TestingModule } from '@nestjs/testing';
import { SubAttributeService } from './sub-attribute.service';

describe('SubAttributeService', () => {
  let service: SubAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubAttributeService],
    }).compile();

    service = module.get<SubAttributeService>(SubAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
