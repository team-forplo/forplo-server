import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publicTransportation: number;

  @Column()
  plug: number;

  @Column()
  cleanTable: number;

  @Column()
  tumbler: number;

  @Column()
  separateCollection: number;

  @Column()
  shoppingBasket: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
