export interface MembershipPeriod {
  id: number; // unique identifier for the membership period for db reference
  uuid: string; // unique identifier for the membership period, used for external references
  membership: number; // membership the period is attached to
  start: Date; // indicates the start of the period
  end: Date; // indicates the end of the period
  state: string;
}
