import { Test, TestingModule } from '@nestjs/testing';
import { PublicSharingService } from './public-sharing.service';

describe('PublicSharingService', () => {
  let service: PublicSharingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicSharingService],
    }).compile();

    service = module.get<PublicSharingService>(PublicSharingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
