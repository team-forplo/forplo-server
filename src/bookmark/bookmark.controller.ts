import { BookmarkType } from 'src/bookmark/entities/bookmark.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmark')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: '북마크 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '북마크' })
  async create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: User,
  ) {
    const bookmark = await this.bookmarkService.create(createBookmarkDto, user);
    return {
      message: '북마크 성공',
      data: {
        id: bookmark.id,
      },
    };
  }

  @Get()
  @ApiQuery({
    name: 'type',
    example: '국내여행',
    required: true,
    description: '북마크 타입 (국내여행, 추천코스, 둘레길)',
  })
  @ApiResponse({
    status: 200,
    description: '내 북마크 조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '내 북마크 조회' })
  async findAll(@Query('type') type: BookmarkType, @CurrentUser() user: User) {
    const data = await this.bookmarkService.findAll(type, user);
    return {
      message: '내 북마크 조회 성공',
      data,
    };
  }

  @Delete()
  @ApiResponse({
    status: 201,
    description: '북마크 취소',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '북마크 취소' })
  async remove(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: User,
  ) {
    await this.bookmarkService.remove(createBookmarkDto, user);
    return {
      message: '북마크 삭제 성공',
    };
  }
}
