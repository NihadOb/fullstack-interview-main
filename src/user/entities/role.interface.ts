export default interface Role {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
