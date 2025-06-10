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
import { MemoryDataProvider } from '@app/core/database/providers/memory-data.provider';
import { CreateMembershipRequestDto } from '@app/membership/dtos';
import { BillingInterval } from '@app/membership/enums/billing-interval.enum';
import ErrorResponseDto from '@app/core/dtos/error-response.dto';
import { PaymentMethod } from '@app/membership/enums/payment-method.enum';
import { data } from './membership.data';

describe('MembershipController - Validation (e2e)', () => {
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

  it('/memberships (POST) - Invalid name - should fail with error missingMandatoryFields', async () => {
    const dto = {
      recurringPrice: 10,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error.message).not.toBeUndefined();
    expect(error.message).toContain('missingMandatoryFields');
  });

  it('/memberships (POST) - Invalid recurringPrice - should fail with error missingMandatoryFields', async () => {
    const dto = {
      name: 'Platinum Plan',
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('missingMandatoryFields');
  });

  it('/memberships (POST) - recurringPrice price above 100 and paymentMethod is cash - should fail with error cashPriceBelow100', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 101,
      paymentMethod: PaymentMethod.CASH,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('cashPriceBelow100');
  });

  it('/memberships (POST) - invalid billing interval - should fail with error invalidBillingPeriods', async () => {
    const dto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: 'INVALID',
      billingPeriods: 13,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('invalidBillingPeriods');
  });

  it('/memberships (POST) - billing interval monthly and billing period is more than 12 - should fail with error billingPeriodsMoreThan12Months', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 13,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsMoreThan12Months');
  });

  it('/memberships (POST) - billing interval monthly and billing period is less than 6 - should fail with error billingPeriodsLessThan6Months', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 5,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsLessThan6Months');
  });

  it('/memberships (POST) - billing interval year and billing period is greater than 10 - should fail with error billingPeriodsMoreThan10Years', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 11,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsMoreThan10Years');
  });

  it('/memberships (POST) - billing interval year and billing period is less than 3 - should fail with error billingPeriodsLessThan3Years', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 2,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsLessThan3Years');
  });

  it('/v1/memberships (POST) - Invalid name - should fail with error missingMandatoryFields', async () => {
    const dto = {
      recurringPrice: 10,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error.message).not.toBeUndefined();
    expect(error.message).toContain('missingMandatoryFields');
  });

  it('/v1/memberships (POST) - Invalid recurringPrice - should fail with error missingMandatoryFields', async () => {
    const dto = {
      name: 'Platinum Plan',
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('missingMandatoryFields');
  });

  it('/v1/memberships (POST) - recurringPrice price above 100 and paymentMethod is cash - should fail with error cashPriceBelow100', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 101,
      paymentMethod: PaymentMethod.CASH,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 3,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('cashPriceBelow100');
  });

  it('/v1/memberships (POST) - invalid billing interval - should fail with error invalidBillingPeriods', async () => {
    const dto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: 'INVALID',
      billingPeriods: 13,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('invalidBillingPeriods');
  });

  it('/v1/memberships (POST) - billing interval monthly and billing period is more than 12 - should fail with error billingPeriodsMoreThan12Months', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 13,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsMoreThan12Months');
  });

  it('/v1/memberships (POST) - billing interval monthly and billing period is less than 6 - should fail with error billingPeriodsLessThan6Months', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Monthly,
      billingPeriods: 5,
    };

    const response = await request(app.getHttpServer())
      .post('/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsLessThan6Months');
  });

  it('/v1/memberships (POST) - billing interval year and billing period is greater than 10 - should fail with error billingPeriodsMoreThan10Years', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 11,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsMoreThan10Years');
  });

  it('/v1/memberships (POST) - billing interval year and billing period is less than 3 - should fail with error billingPeriodsLessThan3Years', async () => {
    const dto: CreateMembershipRequestDto = {
      name: 'Platinum Plan',
      recurringPrice: 90,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      billingInterval: BillingInterval.Yearly,
      billingPeriods: 2,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/memberships')
      .send(dto)
      .expect(400);

    expect(response.body).not.toBeNull();

    const error = response.body as ErrorResponseDto;
    expect(error?.message).not.toBeUndefined();
    expect(error.message).toContain('billingPeriodsLessThan3Years');
  });
});
