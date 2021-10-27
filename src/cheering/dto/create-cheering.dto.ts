import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCheeringDto {
  @ApiProperty({
    example: 1,
    description: '플로깅 아이디',
    required: true,
  })
  @Column()
  @IsDefined()
  ploggingId: number;
}
