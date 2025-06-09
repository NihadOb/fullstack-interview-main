import { Module } from '@nestjs/common';
import { MembershipService } from './services/membership.service';
import { MembershipRepository } from './repositories/membership.repository';
import { CoreModule } from 'src/core/core.module';
import { MembershipHelperService } from './services/membership-helper.service';
import { MembershipPeriodRepository } from './repositories/membership-period.repository';
import { MembershipController } from './controllers/membership.controller';
import { MembershipTypeRepository } from './repositories/membership-type.repository';
import { MembershipTypeValidator } from './validators/membership-type.validator';

@Module({
  imports: [CoreModule],
  providers: [
    MembershipService,
    MembershipHelperService,
    MembershipRepository,
    MembershipPeriodRepository,
    MembershipTypeRepository,
    MembershipTypeValidator,
  ],
  controllers: [MembershipController],
})
export class MembershipModule {}
