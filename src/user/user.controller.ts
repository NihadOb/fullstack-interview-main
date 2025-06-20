import { Controller, Get } from '@nestjs/common';
import { UserService } from './services/user.service';
import UserDto from './dtos/user.dto';
import RoleDto from './dtos/role.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller({
  version: ['1'],
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  //TODO: Validate access to this endpoint
  @ApiOkResponse({
    type: [UserDto],
    description: 'List of all Users',
  })
  @Get()
  async getAllUserV1(): Promise<UserDto[]> {
    const usersWithRole = await this.userService.getAllUsers();
    if (!usersWithRole || usersWithRole.length === 0) {
      return [];
    }

    return usersWithRole.map(
      (userWithRole) =>
        <UserDto>{
          id: userWithRole.user.id,
          uuid: userWithRole.user.uuid,
          username: userWithRole.user.username,
          firstName: userWithRole.user.firstName,
          lastName: userWithRole.user.lastName,

          email: userWithRole.user.email,
          role: userWithRole.role
            ? <RoleDto>{
                id: userWithRole.role.id,
                uuid: userWithRole.role.uuid,
                name: userWithRole.role.name,
                description: userWithRole.role.description,
              }
            : null,
        },
    );
  }
}
