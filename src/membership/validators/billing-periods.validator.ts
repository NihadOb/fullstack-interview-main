import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { validateBillingPeriods } from './billing-periods-validation.helper';
import { INVALID_BILLING_PERIODS } from '../consts/error-messages.const';

export function BillingPeriodsValidator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'BillingPeriodsValidator',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          const error = validateBillingPeriods(
            obj.billingInterval,
            obj.billingPeriods,
          );
          if (error) {
            // Attach the error message to the object for use in defaultMessage
            obj.__billingPeriodsError = error;
            return false;
          }
          // Clean up any previous error
          delete obj.__billingPeriodsError;
          return true;
        },
        defaultMessage(args: ValidationArguments): string {
          return (
            (args.object as any).__billingPeriodsError ||
            INVALID_BILLING_PERIODS
          );
        },
      },
    });
  };
}
