import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    example: 'head_1',
    description: '머리',
    required: false,
  })
  @Column({ nullable: true, length: 10 })
  head: string;

  @ApiProperty({
    example: 'face_1',
    description: '얼굴',
    required: false,
  })
  @Column({ nullable: true, length: 10 })
  face: string;

  @ApiProperty({
    example: 'hand_1',
    description: '손',
    required: false,
  })
  @Column({ nullable: true, length: 10 })
  hand: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
