import { PickType } from '@nestjs/swagger';
import { Treatment } from '../../domain/treatment.entity';

export class TreatmentRawOne {
  't_id': number;
  't_title': string;
  numberTasks: string;
  completedTasks: string;
  pendingTasks: string;
}

export class TreatmentRawOneDto extends PickType(Treatment, ['id', 'title']) {
  numberTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export class TreatmentTypeOrmPostgresMapper {
  static fromRawMany(rawMany: TreatmentRawOne[]): TreatmentRawOneDto[] {
    return rawMany.map((rawOne) =>
      TreatmentTypeOrmPostgresMapper.fromRawOne(rawOne),
    );
  }

  static fromRawOne(rawOne: TreatmentRawOne): TreatmentRawOneDto {
    return {
      id: rawOne.t_id,
      title: rawOne.t_title,
      numberTasks: parseInt(rawOne.numberTasks),
      completedTasks: parseInt(rawOne.completedTasks),
      pendingTasks: parseInt(rawOne.pendingTasks),
    };
  }
}
