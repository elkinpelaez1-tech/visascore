import { Test, TestingModule } from '@nestjs/testing';
import { VisaTestController } from './visa-test.controller';

describe('VisaTestController', () => {
  let controller: VisaTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisaTestController],
    }).compile();

    controller = module.get<VisaTestController>(VisaTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
