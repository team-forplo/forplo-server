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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'test@naver.com',
    description: '이메일',
    required: true,
  })
  @Column({ unique: true, length: 30 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: '비밀번호',
    required: false,
  })
  @Column({ nullable: true })
  password: string;

  @ApiProperty({
    example: 'test',
    description: '닉네임',
    required: true,
  })
  @Column({ unique: true, length: 30 })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 'http://google.com',
    description: '프로필 이미지 주소',
    required: false,
  })
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
