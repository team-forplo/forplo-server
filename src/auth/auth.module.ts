import { ChallengesModule } from './../challenges/challenges.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessoriesModule } from 'src/accessories/accessories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccessoriesModule,
    ChallengesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
