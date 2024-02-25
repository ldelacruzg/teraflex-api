import { Patient, StoreItem } from '@/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'purchased_items' })
export class PurchasedItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantity: number;

  @CreateDateColumn({ name: 'purchase_date', type: 'timestamp with time zone' })
  purchaseDate: Date;

  @ManyToOne(() => Patient, (patient) => patient.purchasedItems)
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => StoreItem, (storeItem) => storeItem.purchasedItems)
  @JoinColumn({ name: 'store_item_id' })
  storeItem: Relation<StoreItem>;
}
