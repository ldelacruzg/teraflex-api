import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Rank } from '@/gamification/leaderboards/domain/rank.enum';
import { Leaderboard, Patient } from '@/entities';

@Entity({ name: 'patient_leaderboards' })
export class PatientLeaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  experience: number;

  @CreateDateColumn({ name: 'joining_date', type: 'timestamp with time zone' })
  joiningDate: Date;

  @Column({
    name: 'current_rank',
    nullable: false,
    type: 'character varying',
    length: 25,
  })
  currentRank: Rank;

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
