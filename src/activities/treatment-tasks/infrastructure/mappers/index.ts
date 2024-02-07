import { TreatmentTasks } from '../../domain/treatment-tasks.entity';
import {
  AssignedTaskDetailDto,
  AssignedTaskFullDetailDto,
} from '../../domain/dtos/assigned-task-detail.dto';
import { LinkRawOne } from '../../domain/dtos/raw/multimedia.raw';

export class TreatmentTasksMapper {
  static toAssignedTaskDetail(
    assignedTask: TreatmentTasks,
  ): AssignedTaskDetailDto {
    return {
      assignmentId: assignedTask.id,
      treatment: {
        id: assignedTask.treatment.id,
        title: assignedTask.treatment.title,
        description: assignedTask.treatment.description,
        startDate: assignedTask.treatment.startDate,
        endDate: assignedTask.treatment.endDate,
      },
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

  static toMultimedia(raw: LinkRawOne[]): MultimediaDto[] {
    return raw.map((r) => ({
      id: r.l_id,
      title: r.l_title,
      description: r.l_description,
      url: r.l_url,
      status: r.l_status,
      type: r.l_type,
      therapist: r.therapist,
    }));
  }
}
