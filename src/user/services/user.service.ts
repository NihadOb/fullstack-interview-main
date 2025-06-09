import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { RoleRepository } from '../repositories/roles.repository';
import Role from '../entities/role.interface';
import User from '../entities/user.interface';

export interface UserWithRole {
  user: User;
  role?: Role | null;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  /**
   * Get all users with their roles.
   * @returns
   */
  async getAllUsers(): Promise<UserWithRole[]> {
    try {
      const allUsers = await this.userRepository.findAll();
      const allRoles = await this.roleRepository.findAll();

      const usersWithRole: UserWithRole[] = allUsers.map((user) => {
        return {
          user,
          role: allRoles.find((role) => role.id === user.roleId),
        };
      });
      return usersWithRole;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID with their role.
   * @param id User ID
   * @returns User with role
   */
  async getUserById(id: number): Promise<UserWithRole | null> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }
      const role = await this.roleRepository.findById(user.roleId);
      return {
        user,
        role,
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }
}
