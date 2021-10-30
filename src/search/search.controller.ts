import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { SearchService } from './search.service';

@Controller('search')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/top')
  @ApiResponse({
    status: 200,
    description: '오늘의 추천 여행지 조회 성공',
  })
  @ApiOperation({ summary: '오늘의 추천 여행지 조회' })
  async findTopList() {
    const data = await this.searchService.findTopList();
    return {
      message: '오늘의 추천 여행지 조회 성공',
      data,
    };
  }
}
