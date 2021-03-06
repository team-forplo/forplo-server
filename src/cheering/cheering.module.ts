import { PloggingsModule } from './../ploggings/ploggings.module';
import { Cheering } from './entities/cheering.entity';
import { Module } from '@nestjs/common';
import { CheeringService } from './cheering.service';
import { CheeringController } from './cheering.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cheering]), PloggingsModule],
  controllers: [CheeringController],
  providers: [CheeringService],
  exports: [TypeOrmModule],
})
export class CheeringModule {}
