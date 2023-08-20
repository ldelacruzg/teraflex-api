import { CreateManyAssignmentsDto } from '../controllers/assignment/dto/create-many-assignments.dto';

export interface ICreateAssignment
  extends Omit<CreateManyAssignmentsDto, 'tasks'> {
  userId: number;
  taskId: number;
  estimatedTime: number;
  description: string;
}
