import {
  Body,
  Controller,
  Get,
  Post,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  CreateMembershipRequestDto,
  CreateMembershipResponseDto,
  GetAllMembershipsResponseDataItemDto,
  GetAllMembershipsResponseDto,
} from '../dtos';
import { MembershipService } from '../services';
import { toDtos, toDto } from 'src/core/helpers/transform.helper';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import ErrorResponseDto from '../../core/dtos/error-response.dto';

@ApiTags('Membership')
@Controller({
  version: [VERSION_NEUTRAL, '1'],
  path: 'memberships',
})
export class MembershipController {
  private userId = 2000;
  constructor(private readonly membershipService: MembershipService) {}

  /**
   * List all memberships
   * @returns Memberships with their periods
   * @deprecated use endpoint with version
   */
  @ApiOkResponse({
    type: [GetAllMembershipsResponseDataItemDto],
    description: 'List of all memberships with their periods',
  })
  @Version(VERSION_NEUTRAL)
  @Get()
  async getMemberships(): Promise<GetAllMembershipsResponseDto> {
    const memberships = await this.membershipService.findAll();
    return toDtos(GetAllMembershipsResponseDataItemDto, memberships);
  }

  /**
   * List all memberships
   * @returns Memberships with their periods
   */
  @ApiOkResponse({
    type: [GetAllMembershipsResponseDataItemDto],
    description: 'List of all memberships with their periods',
  })
  @Version('1')
  @Get()
  async getMembershipsV1(): Promise<GetAllMembershipsResponseDto> {
    const memberships = await this.membershipService.findAll();
    return toDtos(GetAllMembershipsResponseDataItemDto, memberships);
  }

  /**
   * Create a new membership and its periods
   * @param createMembershipDto request body
   * @deprecated use endpoint with version
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
  @Version('1')
  @Post()
  async createMembershipV1(
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
