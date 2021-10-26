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
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined } from 'class-validator';

@Entity()
export class Plogging {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '서울특별시',
    description: '시/도',
    required: true,
  })
  @Column({ length: 20 })
  @IsNotEmpty()
  firstLocation: string;

  @ApiProperty({
    example: '서울특별시 용산구',
    description: '장소',
    required: true,
  })
  @Column({ length: 20 })
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 2.7,
    description: '거리 (KM)',
    required: true,
  })
  @Column({ type: 'float' })
  @IsDefined()
  distance: number;

  @ApiProperty({
    example: 10,
    description: '시간 (분)',
    required: true,
  })
  @Column()
  @IsDefined()
  time: number;

  @ApiProperty({
    example:
      'https://forplo-bucket.s3.ap-northeast-2.amazonaws.com/forplo/profile/99e1e2be-8160-4e58-a540-3220a2c1179a.png',
    description: '플로깅 이미지 URL',
  })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({
    example: '새벽에 플로깅은 할 짓이 아니다.',
    description: '메모',
  })
  @Column({ nullable: true })
  memo: string;

  @ApiProperty({
    example: true,
    description: '공개 여부',
    required: true,
  })
  @Column({ default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ploggings, { nullable: false })
  user: User;

  @OneToMany(() => Cheering, (cheering) => cheering.plogging)
  cheering: Cheering[];
}
