import { Module } from '@nestjs/common';
import { MembershipService } from './services/membership.service';
import { MembershipRepository } from './repositories/membership.repository';
import { CoreModule } from '@app/core/core.module';
import { MembershipHelperService } from './services/membership-helper.service';
import { MembershipPeriodRepository } from './repositories/membership-period.repository';
import { MembershipController } from './controllers/membership.controller';
import { MembershipTypeRepository } from './repositories/membership-type.repository';
import { MembershipTypeValidator } from './validators/membership-type.validator';
import { MembershipExportProcessor } from './processors/export-membership/membership-export.processor';
import { BullModule } from '@nestjs/bull';
import { MEMBERSHIP_EXPORT_QUEUE_V1 } from '@app/core/constants/queues';
import { UserModule } from '@app/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CoreModule,
    BullModule.registerQueueAsync({
      name: MEMBERSHIP_EXPORT_QUEUE_V1,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [
    MembershipExportProcessor,
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
