export interface GetGroupI {
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
