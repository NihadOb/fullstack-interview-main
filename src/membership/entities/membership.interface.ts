export interface Membership {
  id: number; // unique identifier for the membership for db reference
  uuid: string; // unique identifier for the membership, used for external references
  name: string; // name of the membership
  user: number; // the user that the membership is assigned to
  recurringPrice: number; // price the user has to pay for every period
  validFrom: Date; // start of the validity
  validUntil: Date; // end of the validity
  state: string; // indicates the state of the membership
  paymentMethod: string; // which payment method will be used to pay for the periods
  billingInterval: string; // the interval unit of the periods
  billingPeriods: number; // the number of periods the membership has
}
