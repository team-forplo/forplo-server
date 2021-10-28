import { PickType } from '@nestjs/swagger';
import { Accessory } from '../entities/accessory.entity';

export class UpdateAccessoryDto extends PickType(Accessory, [
  'head',
  'face',
  'hand',
] as const) {}
