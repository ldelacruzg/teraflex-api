import { RoleEnum } from '@security/jwt-strategy/role.enum';

export interface GetUserI {
  id: number;
  firstName: string;
  lastName: string;
  docNumber: string;
  phone: string;
  description: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
  role: RoleEnum;
  categoryId: number;
  categoryName: string;
  status: boolean;
}

export interface GetManyUsersI {
  id: number;
  firstName: string;
  lastName: string;
  docNumber: string;
  phone: string;
  description: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
