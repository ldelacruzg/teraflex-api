import { Task, Treatment } from '@/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum FrecuencyType {
  day = 'day',
  week = 'week',
}

export interface IFrecuency {
  value: number;
  type: FrecuencyType;
}

@Entity({ name: 'treatment_tasks' })
export class TreatmentTasks {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'treatment_id' })
  treatmentId: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @CreateDateColumn({
    name: 'assignment_date',
    type: 'timestamp without time zone',
  })
  assignmentDate: Date;

  @Column({
    name: 'performance_date',
    type: 'timestamp without time zone',
    nullable: true,
  })
  performanceDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({
    name: 'time_per_repetition',
    type: 'double precision',
  })
  timePerRepetition: number;

  @Column()
  repetitions: number;

  @Column({ type: 'json', nullable: true })
  frecuency: IFrecuency;

  @Column({
    name: 'break_time',
    type: 'double precision',
    nullable: true,
  })
  breakTime: number;

  @Column()
  series: number;

  // Relations
  @ManyToOne(() => Treatment, (treatment) => treatment.treatmentTasks)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Relation<Treatment>;

  @ManyToOne(() => Task, (task) => task.treatmentTasks)
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;
}
