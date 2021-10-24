import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessoriesModule } from './accessories/accessories.module';
import { ArticlesModule } from './articles/articles.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PloggingsModule } from './ploggings/ploggings.module';
import { CheeringModule } from './cheering/cheering.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    AccessoriesModule,
    ArticlesModule,
    ChallengesModule,
    PloggingsModule,
    CheeringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
