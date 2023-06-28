import { Request } from 'express';
import { RoleEnum } from './role.enum';

export interface InfoUserInterface {
  id: number;
  docNumber: string;
  role: RoleEnum;
}
