import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CheeringService } from './cheering.service';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('cheering')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class CheeringController {
  constructor(private readonly cheeringService: CheeringService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: '좋아요 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 404,
    description: '좋아요 실패',
  })
  @ApiOperation({ summary: '좋아요' })
  async create(
    @Body() createCheeringDto: CreateCheeringDto,
    @CurrentUser() user: User,
  ) {
    const cheering = await this.cheeringService.create(createCheeringDto, user);
    return {
      message: '좋아요 성공',
      data: {
        id: cheering.id,
      },
    };
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: '좋아요 수 조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 404,
    description: '좋아요 수 조회 실패',
  })
  @ApiOperation({ summary: '좋아요 수 조회' })
  async findAll(
    @Body() createCheeringDto: CreateCheeringDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.cheeringService.findAll(createCheeringDto, user);
    return {
      message: '좋아요 수 조회 성공',
      data,
    };
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: '좋아요 취소 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 404,
    description: '좋아요 취소 실패',
  })
  @ApiOperation({ summary: '좋아요 취소' })
  async remove(
    @Body() createCheeringDto: CreateCheeringDto,
    @CurrentUser() user: User,
  ) {
    await this.cheeringService.remove(createCheeringDto, user);
    return {
      message: '좋아요 취소 성공',
    };
  }
}
