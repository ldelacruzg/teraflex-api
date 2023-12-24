import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import {
  User,
  Treatment,
  Streak,
  PurchasedItem,
  UseStoreItem,
  PatientLeaderboard,
} from '@/entities';

import { Rank } from '@/gamification/leaderboards/domain/rank.enum';

@Entity({ name: 'patients' })
export class Patient {
  // Fields
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  flexicoins: number;

  @Column({ nullable: false, default: 0 })
  experience: number;

  @Column({
    nullable: false,
    default: Rank.Fortaleza,
    type: 'character varying',
    length: 25,
  })
  rank: Rank;

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
  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: Relation<User>;

  @OneToMany(() => Treatment, (treatment) => treatment.patient)
  treatments: Relation<Treatment[]>;

  @OneToMany(() => Streak, (streak) => streak.patient)
  streaks: Relation<Streak[]>;

  @OneToMany(() => PurchasedItem, (purchasedItem) => purchasedItem.patient)
  purchasedItems: Relation<PurchasedItem[]>;

  @OneToMany(() => UseStoreItem, (useStoreItem) => useStoreItem.patient)
  useStoreItems: Relation<UseStoreItem[]>;

  @OneToMany(
    () => PatientLeaderboard,
    (patientLeaderboard) => patientLeaderboard.patient,
  )
  patientLeaderboards: Relation<PatientLeaderboard[]>;
}
