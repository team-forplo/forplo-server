import { Cheering } from './../../cheering/entities/cheering.entity';
import { User } from './../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plogging {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  location: string;

  @Column({ type: 'float' })
  distance: number;

  @Column()
  time: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  memo: string;

  @Column({ default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ploggings)
  user: User;

  @OneToMany(() => Cheering, (cheering) => cheering.plogging)
  cheering: Cheering[];
}
