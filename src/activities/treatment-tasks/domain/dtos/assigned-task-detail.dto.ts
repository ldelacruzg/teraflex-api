import { IFrecuency } from '../treatment-tasks.entity';

export class AssignedTaskDetailDto {
  assignmentId: number;
  assignmentDate: Date;
  expirationDate: Date;
  performanceDate: Date;
  treatment: Treatment;
  task: Task;
  setting: TaskSetting;
}

export class AssignedTaskFullDetailDto extends AssignedTaskDetailDto {
  multimedia: Multimedia[];
}

class Treatment {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
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

class Multimedia {
  id: number; // link id
  url: string;
  title: string;
  description: string;
}
