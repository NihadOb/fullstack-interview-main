import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { MembershipService } from '../services';
import { MISSING_MANDATORY_FIELDS } from '../consts/error-messages.const';

@ValidatorConstraint({ async: true })
@Injectable()
export class MembershipTypeValidator implements ValidatorConstraintInterface {
  constructor(private readonly membershipService: MembershipService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    return await this.membershipService.isValidMembershipType(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    return MISSING_MANDATORY_FIELDS;
  }
}
