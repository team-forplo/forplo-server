import { Plogging } from './entities/plogging.entity';
import { Module } from '@nestjs/common';
import { PloggingsService } from './ploggings.service';
import { PloggingsController } from './ploggings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Plogging])],
  controllers: [PloggingsController],
  providers: [PloggingsService],
  exports: [TypeOrmModule],
})
export class PloggingsModule {}
