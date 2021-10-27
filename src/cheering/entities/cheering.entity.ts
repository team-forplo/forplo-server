import { Plogging } from './../../ploggings/entities/plogging.entity';
import { User } from './../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export enum CheeringType {
  HEART = 'heart',
  FLAG = 'flag',
  SCORE = 'score',
  GOOD = 'good',
  KISS = 'kiss',
}

@Entity()
export class Cheering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['heart', 'flag', 'score', 'good', 'kiss'],
    default: 'heart',
  })
  @IsNotEmpty()
  type: CheeringType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cheering, { nullable: false })
  user: User;

  @ManyToOne(() => Plogging, (plogging) => plogging.cheering, {
    nullable: false,
  })
  plogging: Plogging;
}
