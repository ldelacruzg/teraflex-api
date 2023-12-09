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

import { Patient } from '@/entities';

@Entity({ name: 'streaks' })
export class Streak {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'is_active', nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.streaks)
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;
}
