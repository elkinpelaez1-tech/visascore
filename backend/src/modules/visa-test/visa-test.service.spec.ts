import { Test, TestingModule } from '@nestjs/testing';
import { VisaTestService } from './visa-test.service';

describe('VisaTestService', () => {
  let service: VisaTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisaTestService],
    }).compile();

    service = module.get<VisaTestService>(VisaTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
