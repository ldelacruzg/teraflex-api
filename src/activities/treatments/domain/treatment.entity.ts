import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Patient, User } from '@/entities';

@Entity({ name: 'treatments' })
export class Treatment {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', nullable: false })
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
}
