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
import { Bookmark } from 'src/bookmark/entities/bookmark.entity';

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
    example: '1234',
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
    example:
      'https://forplo-bucket.s3.ap-northeast-2.amazonaws.com/forplo/profile/99e1e2be-8160-4e58-a540-3220a2c1179a.png',
    description: '프로필 이미지 URL',
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

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmark: Bookmark[];
}
