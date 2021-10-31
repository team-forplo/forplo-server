import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsNotEmpty } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum BookmarkType {
  TOUR = '국내여행',
  COURSE = '추천코스',
  TRAIL = '둘레길',
}

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: BookmarkType.TOUR,
    description: '북마크 타입 (국내여행, 추천코스, 둘레길)',
    required: true,
  })
  @Column({
    type: 'enum',
    enum: ['국내여행', '추천코스', '둘레길'],
    default: '국내여행',
  })
  @IsNotEmpty()
  type: BookmarkType;

  @ApiProperty({
    example: 125858,
    description: '콘텐츠 아이디',
    required: true,
  })
  @IsInt()
  @IsDefined()
  @Column()
  contentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bookmark, {
    onDelete: 'SET NULL',
  })
  user: User;
}
