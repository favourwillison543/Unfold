import { Test, TestingModule } from '@nestjs/testing';
import { PublicSharingController } from './public-sharing.controller';

describe('PublicSharingController', () => {
  let controller: PublicSharingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicSharingController],
    }).compile();

    controller = module.get<PublicSharingController>(PublicSharingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
