import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Accessory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 10 })
  hair: string;

  @Column({ nullable: true, length: 10 })
  face: string;

  @Column({ nullable: true, length: 10 })
  hand: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
