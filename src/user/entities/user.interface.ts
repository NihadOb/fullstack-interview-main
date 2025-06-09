export default interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;

  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}
