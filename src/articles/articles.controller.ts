import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ArticlesService } from './articles.service';

@Controller('articles')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: '환경 정보 목록 조회 성공',
  })
  @ApiOperation({ summary: '환경 정보 목록 조회 (최신순)' })
  async findAll() {
    const articles = await this.articlesService.findAll();
    return {
      message: '환경 정보 목록 조회 성공',
      data: articles,
    };
  }
}
