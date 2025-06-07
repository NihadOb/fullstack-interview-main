import { Module } from '@nestjs/common';
import { MembershipService } from './services/membership.service';
import { MembershipRepository } from './repositories/membership.repository';
import { CoreModule } from 'src/core/core.module';
import { MembershipHelperService } from './services/membership-helper.service';
import { MembershipPeriodRepository } from './repositories/membership-period.repository';
import { MembershipController } from './controllers/membership.controller';

@Module({
  imports: [CoreModule],
  providers: [
    MembershipService,
    MembershipHelperService,
    MembershipRepository,
    MembershipPeriodRepository,
  ],
  controllers: [MembershipController],
})
export class MembershipModule {}
