import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { PaymentMethod } from '../types/payment-method.enum';
import { CASH_PRICE_BELOW_100 } from '../consts/error-messages.const';

export function CashPriceBelowLimit(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'cashPriceBelowLimit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;
          if (!obj.recurringPrice) {
            return true; // If recurringPrice is not defined, skip validation
          }
          return !(
            obj.paymentMethod === PaymentMethod.CASH && obj.recurringPrice > 100
          );
        },
        defaultMessage() {
          return CASH_PRICE_BELOW_100;
        },
      },
    });
  };
}
