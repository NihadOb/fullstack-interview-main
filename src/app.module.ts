import { Module } from '@nestjs/common';
import { MembershipModule } from './membership/membership.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MembershipModule, CoreModule, UserModule],
})
export class AppModule {}
