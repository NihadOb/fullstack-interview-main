import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CreateMembershipRequestDto,
  CreateMembershipResponseDto,
  GetAllMembershipsResponseDataItemDto,
  GetAllMembershipsResponseDto,
} from '../dtos';
import { MembershipService } from '../services';
import { toDtos, toDto } from 'src/core/helpers/transform.helper';
import { instanceToPlain } from 'class-transformer';
import { Membership } from '../entities/membership.interface';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Membership')
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  /**
   * List all memberships
   * @returns Memberships with their periods
   */
  @ApiOkResponse({
    type: [GetAllMembershipsResponseDataItemDto],
    description: 'List of all memberships with their periods',
  })
  @Get()
  async getMemberships(): Promise<GetAllMembershipsResponseDto> {
    const memberships = await this.membershipService.findAll();
    return toDtos(GetAllMembershipsResponseDataItemDto, memberships);
  }

  /**
   * Create a new membership and its periods
   * @param createMembershipDto request body
   */

  @Post()
  async createMembership(
    @Body() createMembershipDto: CreateMembershipRequestDto,
  ): Promise<CreateMembershipResponseDto> {
    const newMembershipToCreate = instanceToPlain(
      createMembershipDto,
    ) as Membership;
    const createMembershipResult = await this.membershipService.create(
      newMembershipToCreate,
    );

    return toDto(CreateMembershipResponseDto, createMembershipResult);
  }
}
