import { Module } from '@nestjs/common';
import { CheeringService } from './cheering.service';
import { CheeringController } from './cheering.controller';

@Module({
  controllers: [CheeringController],
  providers: [CheeringService],
})
export class CheeringModule {}
