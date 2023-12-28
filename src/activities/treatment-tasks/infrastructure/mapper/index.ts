import { TreatmentTasks } from '../../domain/treatment-tasks.entity';
import { AssignedTaskDetailDto } from '../../domain/dtos/assigned-task-detail.dto';

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
}
