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

interface IFrecuency {
  value: number;
  type: 'minute' | 'hour' | 'day' | 'week';
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

  @CreateDateColumn({ name: 'assignment_date' })
  assignmentDate: Date;

  @Column({ name: 'performance_date', type: 'date', nullable: true })
  performanceDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({
    name: 'time_per_repetition',
    type: 'numeric',
    precision: 5,
    scale: 2,
  })
  timePerRepetition: number;

  @Column()
  repetitions: number;

  @Column({ type: 'json' })
  frecuency: IFrecuency;

  @Column({
    name: 'break_time',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  breakTime: number;

  @Column({ nullable: true })
  series: number;

  // Relations
  @ManyToOne(() => Treatment, (treatment) => treatment.treatmentTasks)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Relation<Treatment>;

  @ManyToOne(() => Task, (task) => task.treatmentTasks)
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;
}
