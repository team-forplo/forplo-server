import { IsDefined, IsInt } from 'class-validator';
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
  @IsInt()
  @IsDefined()
  publicTransportation: number;

  @Column()
  @IsInt()
  @IsDefined()
  plug: number;

  @Column()
  @IsInt()
  @IsDefined()
  cleanTable: number;

  @Column()
  @IsInt()
  @IsDefined()
  tumbler: number;

  @Column()
  @IsInt()
  @IsDefined()
  separateCollection: number;

  @Column()
  @IsInt()
  @IsDefined()
  shoppingBasket: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
