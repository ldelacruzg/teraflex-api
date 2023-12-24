import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Patient, User } from '@/entities';
import { TreatmentTasks } from '@/activities/treatment-tasks/domain/treatment-tasks.entity';

@Entity({ name: 'treatments' })
export class Treatment {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 70 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true, type: 'date' })
  endDate: Date;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'therapist_id' })
  therapistId: number;

  // Fields for audit
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.treatments)
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => User, (user) => user.treatments)
  @JoinColumn({ name: 'therapist_id' })
  therapist: Relation<User>;

  @OneToMany(() => TreatmentTasks, (treatmentTasks) => treatmentTasks.treatment)
  treatmentTasks: Relation<TreatmentTasks[]>;
}
