import { Accessory } from './entities/accessory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AccessoriesService } from './accessories.service';
import { AccessoriesController } from './accessories.controller';
import { PloggingsModule } from 'src/ploggings/ploggings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory]), PloggingsModule],
  controllers: [AccessoriesController],
  providers: [AccessoriesService],
  exports: [TypeOrmModule],
})
export class AccessoriesModule {}
