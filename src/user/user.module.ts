import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { RoleRepository } from './repositories/roles.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, RoleRepository, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
