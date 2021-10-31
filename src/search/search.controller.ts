import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { SearchService } from './search.service';

@Controller('search')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/course/:contentid')
  @ApiParam({
    name: 'contentid',
    example: 2361026,
    required: true,
    description: '콘텐츠 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '추천코스 상세 정보 조회 성공',
  })
  @ApiOperation({ summary: '추천코스 상세 정보 조회' })
  async findCourseDetail(
    @Param('contentid', ParseIntPipe) contentid: number,
    @CurrentUser() user: User,
  ) {
    const data = await this.searchService.findCourseDetail(contentid, user);
    return {
      message: '추천코스 상세 정보 조회 성공',
      data,
    };
  }

  @Get('/course')
  @ApiQuery({
    name: 'numOfRows',
    example: 2,
    required: true,
    description: '한 페이지 결과 수',
  })
  @ApiQuery({
    name: 'pageNo',
    example: 1,
    required: true,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'keyword',
    example: '제주',
    required: false,
    description: '검색어',
  })
  @ApiQuery({
    name: 'areaCode',
    example: '제주도',
    required: false,
    description: '지역',
  })
  @ApiQuery({
    name: 'cat2',
    example: '가족코스',
    required: false,
    description: '중분류',
  })
  @ApiResponse({
    status: 200,
    description: '추천코스 검색 목록 조회 성공',
  })
  @ApiOperation({ summary: '추천코스 검색 목록 조회' })
  async findCourseList(
    @Query('numOfRows', ParseIntPipe) rows: number,
    @Query('pageNo', ParseIntPipe) page: number,
    @Query('keyword') keyword: string,
    @Query('areaCode') areaCode: string,
    @Query('cat2') cat2: string,
    @CurrentUser() user: User,
  ) {
    const data = await this.searchService.findCourseList(
      rows,
      page,
      keyword,
      areaCode,
      cat2,
      user,
    );
    return {
      message: '추천코스 검색 목록 조회',
      data,
    };
  }

  @Get('/top')
  @ApiResponse({
    status: 200,
    description: '오늘의 추천 여행지 목록 조회 성공',
  })
  @ApiOperation({ summary: '오늘의 추천 여행지 목록 조회' })
  async findTopList() {
    const data = await this.searchService.findTopList();
    return {
      message: '오늘의 추천 여행지 목록 조회 성공',
      data,
    };
  }

  @Get('/:contentid')
  @ApiParam({
    name: 'contentid',
    example: 125841,
    required: true,
    description: '콘텐츠 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '국내여행 상세 정보 조회 성공',
  })
  @ApiOperation({ summary: '국내여행 상세 정보 조회' })
  async findDetail(
    @Param('contentid', ParseIntPipe) contentid: number,
    @CurrentUser() user: User,
  ) {
    const data = await this.searchService.findDetail(contentid, user);
    return {
      message: '국내여행 상세 정보 조회 성공',
      data,
    };
  }

  @Get('/')
  @ApiQuery({
    name: 'numOfRows',
    example: 2,
    required: true,
    description: '한 페이지 결과 수',
  })
  @ApiQuery({
    name: 'pageNo',
    example: 1,
    required: true,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'keyword',
    example: '한라',
    required: false,
    description: '검색어',
  })
  @ApiQuery({
    name: 'areaCode',
    example: '제주도',
    required: false,
    description: '지역',
  })
  @ApiQuery({
    name: 'cat1',
    example: '자연',
    required: false,
    description: '대분류',
  })
  @ApiQuery({
    name: 'cat2',
    example: '자연관광지',
    required: false,
    description: '중분류',
  })
  @ApiResponse({
    status: 200,
    description: '국내여행 검색 목록 조회 성공',
  })
  @ApiOperation({ summary: '국내여행 검색 목록 조회' })
  async findKeywordList(
    @Query('numOfRows', ParseIntPipe) rows: number,
    @Query('pageNo', ParseIntPipe) page: number,
    @Query('keyword') keyword: string,
    @Query('areaCode') areaCode: string,
    @Query('cat1') cat1: string,
    @Query('cat2') cat2: string,
    @CurrentUser() user: User,
  ) {
    const data = await this.searchService.findKeywordList(
      rows,
      page,
      keyword,
      areaCode,
      cat1,
      cat2,
      user,
    );
    return {
      message: '국내여행 검색 목록 조회',
      data,
    };
  }
}
