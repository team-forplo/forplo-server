import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: '챌린지 조회 성공',
  })
  @ApiOperation({ summary: '챌린지 조회' })
  async findOne(@CurrentUser() user: User) {
    const data = await this.challengesService.findOne(user);
    return {
      message: '챌린지 조회 성공',
      data,
    };
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: '챌린지 체크리스트 인증 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족 or 챌린지 체크리스트 인증 실패',
  })
  @ApiOperation({ summary: '챌린지 체크리스트 인증' })
  async update(
    @CurrentUser() user: User,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    const challenge = await this.challengesService.update(
      user,
      updateChallengeDto,
    );
    return {
      message: '챌린지 체크리스트 인증 성공',
      data: challenge,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(+id);
  }
}
