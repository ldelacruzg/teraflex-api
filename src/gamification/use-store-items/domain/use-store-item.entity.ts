import { Patient, StoreItem } from '@/entities';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'use_store_items' })
export class UseStoreItem {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'use_date', type: 'timestamp with time zone' })
  useDate: Date;

  @ManyToOne(() => Patient, (patient) => patient.useStoreItems)
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => StoreItem, (storeItem) => storeItem.useStoreItems)
  @JoinColumn({ name: 'store_item_id' })
  storeItem: Relation<StoreItem>;
}
