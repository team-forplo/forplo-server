import { Accessory } from './entities/accessory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AccessoriesService } from './accessories.service';
import { AccessoriesController } from './accessories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Accessory])],
  controllers: [AccessoriesController],
  providers: [AccessoriesService],
  exports: [TypeOrmModule],
})
export class AccessoriesModule {}
