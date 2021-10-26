import { JwtStrategy } from './jwt/jwt.strategy';
import { ChallengesModule } from './../challenges/challenges.module';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessoriesModule } from 'src/accessories/accessories.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterExtendedModule } from 'nestjs-multer-extended';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    MulterExtendedModule.register({
      awsConfig: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        region: process.env.AWS_S3_REGION,
        // ... any options you want to pass to the AWS instance
      },
      bucket: process.env.AWS_S3_BUCKET_NAME,
      basePath: 'forplo',
      fileSize: 7 * 1024 * 1024,
    }),
    TypeOrmModule.forFeature([User]),
    AccessoriesModule,
    ChallengesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, MulterExtendedModule],
})
export class AuthModule {}
