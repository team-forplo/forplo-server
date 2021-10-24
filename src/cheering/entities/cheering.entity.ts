import { Plogging } from './../../ploggings/entities/plogging.entity';
import { User } from './../../auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum CheeringType {
  FLAG = 'flag',
  HEART = 'heart',
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
    enum: ['flag', 'heart', 'score', 'good', 'kiss'],
    default: 'flag',
  })
  type: CheeringType;

  @Column()
  createdAt: string;

  @ManyToOne(() => User, (user) => user.cheering)
  user: User;

  @ManyToOne(() => Plogging, (plogging) => plogging.cheering)
  plogging: Plogging;
}
