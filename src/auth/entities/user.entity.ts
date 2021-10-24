import { Cheering } from './../../cheering/entities/cheering.entity';
import { Plogging } from './../../ploggings/entities/plogging.entity';
import { Challenge } from './../../challenges/entities/challenge.entity';
import { Accessory } from './../../accessories/entities/accessory.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, length: 30 })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Accessory)
  @JoinColumn()
  @ValidateNested()
  accessory: Accessory;

  @OneToOne(() => Challenge)
  @JoinColumn()
  @ValidateNested()
  challenge: Challenge;

  @OneToMany(() => Plogging, (plogging) => plogging.user)
  ploggings: Plogging[];

  @OneToMany(() => Cheering, (cheering) => cheering.user)
  cheering: Cheering[];
}
