import { PartialType } from '@nestjs/mapped-types';
import { CreatePloggingDto } from './create-plogging.dto';

export class UpdatePloggingDto extends PartialType(CreatePloggingDto) {}
