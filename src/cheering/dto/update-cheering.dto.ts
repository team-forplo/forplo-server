import { PartialType } from '@nestjs/mapped-types';
import { CreateCheeringDto } from './create-cheering.dto';

export class UpdateCheeringDto extends PartialType(CreateCheeringDto) {}
