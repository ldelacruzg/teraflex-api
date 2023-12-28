import { TreatmentTasks } from '../../domain/treatment-tasks.entity';
import {
  AssignedTaskDetailDto,
  AssignedTaskFullDetailDto,
} from '../../domain/dtos/assigned-task-detail.dto';

export class TreatmentTasksMapper {
  static toAssignedTaskDetail(
    assignedTask: TreatmentTasks,
  ): AssignedTaskDetailDto {
    return {
      task: {
        id: assignedTask.task.id,
        title: assignedTask.task.title,
        description: assignedTask.task.description,
        assignmentDate: assignedTask.assignmentDate,
        performanceDate: assignedTask.performanceDate,
        expirationDate: assignedTask.expirationDate,
      },
      setting: {
        timePerRepetition: assignedTask.timePerRepetition,
        repetitions: assignedTask.repetitions,
        frecuency: assignedTask.frecuency,
        breakTime: assignedTask.breakTime,
        series: assignedTask.series,
      },
    };
  }

  static toAssignedTaskFullDetail(
    assigment: TreatmentTasks,
  ): AssignedTaskFullDetailDto {
    return {
      ...this.toAssignedTaskDetail(assigment),
      multimedia: assigment.task.tasksMultimedia.map((tm) => ({
        id: tm.link.id,
        url: tm.link.url,
        title: tm.link.title,
        description: tm.link.description,
      })),
    };
  }
}
