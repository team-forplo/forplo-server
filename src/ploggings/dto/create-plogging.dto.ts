import { Plogging } from './../entities/plogging.entity';
import { PickType } from '@nestjs/swagger';
export class CreatePloggingDto extends PickType(Plogging, [
  'firstLocation',
  'location',
  'distance',
  'time',
  'imageUrl',
  'memo',
  'isPublic',
] as const) {}
