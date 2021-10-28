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
  UploadedFile,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { PloggingsService } from './ploggings.service';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

@Controller('ploggings')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class PloggingsController {
  constructor(private readonly ploggingsService: PloggingsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: '플로깅 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '플로깅 생성' })
  async create(
    @Body() createPloggingDto: CreatePloggingDto,
    @CurrentUser() user: User,
  ) {
    const plogging = await this.ploggingsService.create(
      createPloggingDto,
      user,
    );
    return {
      message: '플로깅 생성 성공',
      data: {
        ploggingId: plogging.id,
      },
    };
  }

  @Get('/flag-map')
  @ApiResponse({
    status: 200,
    description: '깃발 지도 조회 성공',
  })
  @ApiOperation({ summary: '깃발 지도 조회' })
  async findFlagMap(@CurrentUser() user: User) {
    const flagMaps = await this.ploggingsService.findFlagMap(user);
    return {
      message: '깃발 지도 조회 성공',
      data: flagMaps,
    };
  }

  @Get('/my')
  @ApiResponse({
    status: 200,
    description: '내 플로깅 목록 & 상세 조회 성공',
  })
  @ApiOperation({ summary: '내 플로깅 목록 & 상세 조회 ' })
  async findAllMy(@CurrentUser() user: User) {
    const ploggings = await this.ploggingsService.findAllMy(user);
    return {
      message: '내 플로깅 목록 & 상세 조회 성공',
      data: ploggings,
    };
  }

  @Get('/summary')
  @ApiResponse({
    status: 200,
    description: '마이페이지 요약 정보 조회 성공',
  })
  @ApiOperation({ summary: '마이페이지 요약 정보 조회' })
  async findSummary(@CurrentUser() user: User) {
    const summary = await this.ploggingsService.findSummary(user);
    return {
      message: '마이페이지 요약 정보 조회 성공',
      data: {
        ...summary,
      },
    };
  }

  @Get()
  @ApiQuery({
    name: 'location',
    example: '용산',
    required: false,
    description: '검색어',
  })
  @ApiResponse({
    status: 200,
    description: '피드 목록 & 상세 조회 성공 (공개 설정 된 플로깅 최신순 정렬)',
  })
  @ApiOperation({ summary: '피드 목록 & 상세 조회 ' })
  async findAll(@Query('location') location: string) {
    const ploggings = await this.ploggingsService.findAll(location);
    return {
      message: '피드 조회 성공',
      data: ploggings,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ploggingsService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    example: '1',
    required: true,
    description: '플로깅 아이디',
  })
  @ApiQuery({
    name: 'is-public',
    example: false,
    required: true,
    description: '공개/비공개 여부',
  })
  @ApiResponse({
    status: 200,
    description: '플로깅 공개/비공개 변경 성공',
  })
  @ApiOperation({ summary: '플로깅 공개/비공개 변경' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('is-public', ParseBoolPipe) isPublic: boolean,
  ) {
    const plogging = await this.ploggingsService.update(id, isPublic);
    return {
      message: '플로깅 공개/비공개 변경 성공',
      data: {
        isPublic: plogging.isPublic,
      },
    };
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: '1',
    required: true,
    description: '삭제할 플로깅 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '플로깅 삭제 성공',
  })
  @ApiOperation({ summary: '플로깅 삭제 ' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ploggingsService.remove(id);
    return { message: '플로깅 삭제 성공' };
  }

  @Post('/upload')
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      dynamicPath: 'plogging',
      randomFilename: true,
      thumbnail: { suffix: 'thumb', width: 480, height: 480 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '플로깅 이미지 업로드 성공',
  })
  @ApiOperation({ summary: '플로깅 이미지 업로드' })
  async uploadProfileImage(@UploadedFile() file: any) {
    const imageUrl = await this.ploggingsService.uploadProfileImage(file);
    return {
      message: '이미지 업로드 성공',
      data: {
        imageUrl,
      },
    };
  }
}
