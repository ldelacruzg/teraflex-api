import { IAssignedTaskFileDetail } from './assigned-task-file-detail.interface';

export interface IAssignedTaskDetail {
  assignmentId: number;
  taskId: number;
  title: string;
  description: string;
  estimatedTime: number;
  isCompleted: boolean;
  createdAt: Date;
  dueDate: Date;
  files: IAssignedTaskFileDetail[];
}
