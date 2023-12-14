import { IAssignedTaskFileDetail } from './assigned-task-file-detail.interface';

export interface IAssignedTaskDetail {
  assignmentId: number;
  taskId: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
  files: IAssignedTaskFileDetail[];
}
