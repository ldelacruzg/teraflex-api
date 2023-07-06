import { CreateManyAssignmentsDto } from './create-many-assignments.dto';

export type CreateAssignmentDto = Omit<CreateManyAssignmentsDto, 'taskIds'> & {
  taskId: number;
};
