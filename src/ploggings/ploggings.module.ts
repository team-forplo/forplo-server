import { AuthModule } from './../auth/auth.module';
import { Plogging } from './entities/plogging.entity';
import { forwardRef, Module } from '@nestjs/common';
import { PloggingsService } from './ploggings.service';
import { PloggingsController } from './ploggings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Plogging]), forwardRef(() => AuthModule)],
  controllers: [PloggingsController],
  providers: [PloggingsService],
  exports: [TypeOrmModule, PloggingsService],
})
export class PloggingsModule {}
