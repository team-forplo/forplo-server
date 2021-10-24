import { Module } from '@nestjs/common';
import { PloggingsService } from './ploggings.service';
import { PloggingsController } from './ploggings.controller';

@Module({
  controllers: [PloggingsController],
  providers: [PloggingsService],
})
export class PloggingsModule {}
