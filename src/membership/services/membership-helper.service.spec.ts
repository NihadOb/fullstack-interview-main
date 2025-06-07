import { Test, TestingModule } from '@nestjs/testing';
import { MembershipHelperService } from './membership-helper.service';

describe('MembershipHelperService', () => {
  let service: MembershipHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipHelperService],
    }).compile();

    service = module.get<MembershipHelperService>(MembershipHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
