import { RoleEnum } from '@security/jwt-strategy/role.enum';

export interface GetUserI extends GetPatientI {
  firstTime?: boolean;
  role: RoleEnum;
  categoryId: number;
  categoryName: string;
}

export interface GetPatientI {
  id: number;
  patientId: number;
  firstName: string;
  lastName: string;
  docNumber: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  description: string;
  birthDate: Date;
}

export interface GetManyUsersI {
  therapists?: any[];
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
