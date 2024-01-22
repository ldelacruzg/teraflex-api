import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Leaderboard, Patient } from '@/entities';

@Entity({ name: 'patient_leaderboards' })
export class PatientLeaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  experience: number;

  @CreateDateColumn({
    name: 'joining_date',
    type: 'timestamp without time zone',
  })
  joiningDate: Date;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'leaderboard_id' })
  leaderboardId: number;

  @ManyToOne(() => Patient, (patient) => patient.patientLeaderboards)
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(
    () => Leaderboard,
    (leaderboard) => leaderboard.patientLeaderboards,
  )
  @JoinColumn({ name: 'leaderboard_id' })
  leaderboard: Relation<Leaderboard>;
}
