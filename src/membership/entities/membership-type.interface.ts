export interface MembershipType {
  id: number; // unique identifier for the membership type for db reference
  uuid: string; // unique identifier for the membership type, used for external references
  name: string; // name of the membership type
}
