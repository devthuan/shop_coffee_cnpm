import { Test, TestingModule } from '@nestjs/testing';
import { ImportReceiptController } from './import_receipt.controller';
import { ImportReceiptService } from './import_receipt.service';

describe('ImportReceiptController', () => {
  let controller: ImportReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportReceiptController],
      providers: [ImportReceiptService],
    }).compile();

    controller = module.get<ImportReceiptController>(ImportReceiptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
