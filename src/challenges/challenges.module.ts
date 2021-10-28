import { PloggingsModule } from 'src/ploggings/ploggings.module';
import { Challenge } from './entities/challenge.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge]),
    forwardRef(() => PloggingsModule),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [TypeOrmModule],
})
export class ChallengesModule {}
