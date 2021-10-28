import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateChallengeDto {
  @ApiProperty({
    example: true,
    description: '대중교통을 이용해 이동하기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  publicTransportation: boolean;

  @ApiProperty({
    example: false,
    description: '출발 전, 불필요한 플러그 뽑기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  plug: boolean;

  @ApiProperty({
    example: true,
    description: '클린 테이블 실천하기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  cleanTable: boolean;

  @ApiProperty({
    example: false,
    description: '다회용기 및 텀블러 사용하기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  tumbler: boolean;

  @ApiProperty({
    example: false,
    description: '쓰레기 분리배출하기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  separateCollection: boolean;

  @ApiProperty({
    example: true,
    description: '장바구니 들고 다니기',
    required: true,
  })
  @Column()
  @IsBoolean()
  @IsDefined()
  shoppingBasket: boolean;
}
