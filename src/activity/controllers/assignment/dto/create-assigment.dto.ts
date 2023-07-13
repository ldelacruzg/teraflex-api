import { CreateManyAssignmentsDto } from './create-many-assignments.dto';

export type CreateAssignmentDto = Omit<CreateManyAssignmentsDto, 'tasks'> & {
  userId: number;
  taskId: number;
};
