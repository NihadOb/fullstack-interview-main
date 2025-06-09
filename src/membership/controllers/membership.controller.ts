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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import ErrorResponseDto from '../../core/dtos/error-response.dto';

@ApiTags('Membership')
@Controller('memberships')
export class MembershipController {
  private userId = 2000;
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

  @ApiCreatedResponse({
    type: CreateMembershipResponseDto,
    description: 'New membership created successfully',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Bad request, please check your input',
  })
  @Post()
  async createMembership(
    @Body() createMembershipDto: CreateMembershipRequestDto,
  ): Promise<CreateMembershipResponseDto> {
    // Export the userId from jwt or session
    const createMembershipResult = await this.membershipService.create(
      this.userId,
      createMembershipDto,
    );

    return toDto(CreateMembershipResponseDto, createMembershipResult);
  }
}
