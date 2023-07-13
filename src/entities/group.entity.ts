import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'therapist_id', type: 'bigint' })
  therapistId: number;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.groupTherapist)
  @JoinColumn({ name: 'therapist_id' })
  therapist: User;

  @ManyToOne(() => User, (user) => user.groupPatient)
  @JoinColumn({ name: 'patient_id' })
  patient: User;
}
