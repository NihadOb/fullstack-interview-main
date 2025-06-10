import { Test, TestingModule } from '@nestjs/testing';
import {
  ConsoleLogger,
  INestApplication,
  ValidationPipe,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@app/app.module';
import { useContainer } from 'class-validator';
import { DATA_PROVIDER_TOKEN } from '@app/core/constants/tokens';
import {
  MemoryDataProvider,
  MemoryDb,
} from '@app/core/database/providers/memory-data.provider';
import User from '@app/user/entities/user.interface';
import Role from '@app/user/entities/role.interface';
import {
  CreateMembershipRequestDto,
  CreateMembershipResponseDto,
  GetAllMembershipsResponseDataItemDto,
  GetAllMembershipsResponseDto,
} from '@app/membership/dtos';
import { BillingInterval } from '@app/membership/enums/billing-interval.enum';
import ErrorResponseDto from '@app/core/dtos/error-response.dto';
import { PaymentMethod } from '@app/membership/enums/payment-method.enum';
import { data } from './membership.data';

describe('MembershipController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATA_PROVIDER_TOKEN)
      .useValue(new MemoryDataProvider(new ConsoleLogger(), data))
      .compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: VERSION_NEUTRAL,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/memberships (GET) should return memberships', async () => {
    const res = await request(app.getHttpServer())
      .get('/memberships')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const response = res.body as GetAllMembershipsResponseDto;
    validateMembership(response);
  });

  it('/v1/memberships (GET) should return memberships', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/memberships')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const response = res.body as GetAllMembershipsResponseDto;
    validateMembership(response);
  });

  /**
   * Validate membership properties
   * @param response
   */
  const validateMembership = (response: GetAllMembershipsResponseDto) => {
    expect(response).not.toBeNull();
    expect(response.length).toBe(3);
    for (
      let membershipIndex = 0;
      membershipIndex < response.length;
      membershipIndex++
    ) {
      const membershipResponse = response[membershipIndex].membership;
      expect(membershipResponse.id).toBe(data.memberships[membershipIndex].id);
      expect(membershipResponse.uuid).toBe(
        data.memberships[membershipIndex].uuid,
      );
      const membershipPeriods = data.membershipPeriods.filter(
        (_) => _.membership == membershipResponse.id,
      );
      expect(response[membershipIndex].periods).toHaveLength(
        membershipPeriods.length,
      );

      //Todo Validate the rest of properties for membership
      for (
        let membershipPeriodIndex = 0;
        membershipPeriodIndex < response[membershipIndex].periods.length;
        membershipPeriodIndex++
      ) {
        const responsePeriod =
          response[membershipIndex].periods[membershipPeriodIndex];
        expect(responsePeriod.id).toBe(
          membershipPeriods[membershipPeriodIndex].id,
        );
        expect(responsePeriod.uuid).toBe(
          membershipPeriods[membershipPeriodIndex].uuid,
        );

        //Todo Validate the rest of properties for membership provider
      }
    }
  };

  it('/v1/memberships (POST) - monthly billingInterval billing periond 6 months - should create a membership', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Gold Plan',
      recurringPrice: 5,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 6,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };

    const res = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(201);

    expect(res.body).not.toBeUndefined();
    expect(res.body).not.toBeNull();

    const responseDto = res.body as CreateMembershipResponseDto;
    expect(responseDto?.membership?.id).not.toBeUndefined();
    expect(responseDto?.membership?.uuid).not.toBeUndefined();

    expect(Array.isArray(responseDto.membershipPeriods)).toBe(true);
    expect(responseDto.membershipPeriods).toHaveLength(dto.billingPeriods);
  });

  it('/v1/memberships (POST) - monthly billingInterval billing period 12 months - should create a membership', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Gold Plan',
      recurringPrice: 5,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 12,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };

    const res = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(201);

    expect(res.body).not.toBeUndefined();
    expect(res.body).not.toBeNull();

    const responseDto = res.body as CreateMembershipResponseDto;
    expect(responseDto?.membership?.id).not.toBeUndefined();
    expect(responseDto?.membership?.uuid).not.toBeUndefined();

    expect(Array.isArray(responseDto.membershipPeriods)).toBe(true);
    expect(responseDto.membershipPeriods).toHaveLength(dto.billingPeriods);
  });

  it('/v1/memberships (POST) - yearly billingInterval billing period 10 years - should create a membership', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Gold Plan',
      recurringPrice: 5,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 10,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };

    const res = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(201);

    expect(res.body).not.toBeUndefined();
    expect(res.body).not.toBeNull();

    const responseDto = res.body as CreateMembershipResponseDto;
    expect(responseDto?.membership?.id).not.toBeUndefined();
    expect(responseDto?.membership?.uuid).not.toBeUndefined();

    expect(Array.isArray(responseDto.membershipPeriods)).toBe(true);
    expect(responseDto.membershipPeriods).toHaveLength(dto.billingPeriods);
  });

  it('/v1/memberships (POST) - yearly billingInterval billing period 3 years - should create a membership', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Gold Plan',
      recurringPrice: 5,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 3,
      paymentMethod: PaymentMethod.CREDIT_CARD,
    };

    const res = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(201);

    expect(res.body).not.toBeUndefined();
    expect(res.body).not.toBeNull();

    const responseDto = res.body as CreateMembershipResponseDto;
    expect(responseDto?.membership?.id).not.toBeUndefined();
    expect(responseDto?.membership?.uuid).not.toBeUndefined();

    expect(Array.isArray(responseDto.membershipPeriods)).toBe(true);
    expect(responseDto.membershipPeriods).toHaveLength(dto.billingPeriods);
  });
});
