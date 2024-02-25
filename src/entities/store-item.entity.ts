import { PurchasedItem, UseStoreItem } from '@/entities';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

enum TypeStoreItem {
  'Vidas',
  'Potenciadores',
}

@Entity({ name: 'store_items' })
export class StoreItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 25 })
  name: string;

  @Column({ nullable: false })
  flexicoins: number;

  @Column({ nullable: false, name: 'purchase_limit' })
  purchaseLimit: number;

  @Column({ nullable: false, name: 'utilization_limit' })
  utilizationLimit: number;

  @Column({ nullable: false, type: 'character varying', length: 25 })
  type: TypeStoreItem;

  @OneToMany(() => PurchasedItem, (purchasedItem) => purchasedItem.storeItem)
  purchasedItems: Relation<PurchasedItem[]>;

  @OneToMany(() => UseStoreItem, (useStoreItem) => useStoreItem.storeItem)
  useStoreItems: Relation<UseStoreItem[]>;
}
