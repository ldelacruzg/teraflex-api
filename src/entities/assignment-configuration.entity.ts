import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Assignment } from './assignment.entity';

interface Frecuency {
  value: number;
  unit: 'minute' | 'hour' | 'day' | 'week';
}

@Entity({ name: 'assignment_configurations' })
export class AssignmentConfiguration {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'time_per_repetition',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  timePerRepetition?: number;

  @Column({ type: 'smallint', nullable: true })
  repetitions?: number;

  @Column({ type: 'json', nullable: true })
  frecuency?: Frecuency;

  @Column({
    name: 'break_time',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  breakTime?: number;

  @Column({ name: 'series', nullable: true })
  series?: number;

  // Relations
  @OneToOne(() => Assignment, (assignment) => assignment.assigmentConfiguration)
  @JoinColumn({ name: 'assignment_id' })
  assigment: Relation<Assignment>;
}
