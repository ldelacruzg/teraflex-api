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

import { Assignment, Patient, User } from '@/entities';

@Entity({ name: 'treatments' })
export class Treatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', nullable: false })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.treatments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => User, (user) => user.treatments)
  @JoinColumn({ name: 'therapist_id' })
  therapist: User;

  @OneToMany(() => Assignment, (assigment) => assigment.treatment)
  assignments: Relation<Assignment[]>;
}
