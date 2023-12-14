import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';
import { AssignmentConfiguration } from './assignment-configuration.entity';
import { Treatment } from '.';

@Entity('assignment')
export class Assignment {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date; // Fecha limite

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  // Fields for audit
  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedById: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date; // Fecha de asignación/creación

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date; // Fecha de cumplimiento/actualización

  // Relations
  @ManyToOne(() => User, (user) => user.assignments, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Task, (task) => task.assignments, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;

  @ManyToOne(() => User, (user) => user.assignmentsCreated, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.assignmentsUpdated, { eager: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;

  @OneToOne(
    () => AssignmentConfiguration,
    (assigmentConfiguration) => assigmentConfiguration.assigment,
  )
  assigmentConfiguration: Relation<AssignmentConfiguration>;

  @ManyToOne(() => Treatment, (treatment) => treatment.assignments)
  @JoinColumn({ name: 'treatment_id' })
  treatment: Relation<Treatment>;
}
