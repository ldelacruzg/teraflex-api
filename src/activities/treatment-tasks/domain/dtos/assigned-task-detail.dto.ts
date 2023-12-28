import { IFrecuency } from '../treatment-tasks.entity';

export class AssignedTaskDetailDto {
  task: Task;
  setting: TaskSetting;
}

class Task {
  id: number;
  title: string;
  description: string;
  assignmentDate: Date;
  performanceDate: Date;
  expirationDate: Date;
}

class TaskSetting {
  timePerRepetition: number;
  repetitions: number;
  frecuency: IFrecuency;
  breakTime: number;
  series: number;
}
