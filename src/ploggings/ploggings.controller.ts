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
import { PloggingsService } from './ploggings.service';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { UpdatePloggingDto } from './dto/update-plogging.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('ploggings')
@UseInterceptors(SuccessInterceptor)
export class PloggingsController {
  constructor(private readonly ploggingsService: PloggingsService) {}

  @ApiBearerAuth('accesskey')
  @ApiResponse({
    status: 201,
    description: '플로깅 생성 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '플로깅 생성' })
  @Post()
  @UseGuards(JwtAuthGuard)
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
        plogging: plogging.id,
      },
    };
  }

  @Get()
  findAll() {
    return this.ploggingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ploggingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePloggingDto: UpdatePloggingDto,
  ) {
    return this.ploggingsService.update(+id, updatePloggingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ploggingsService.remove(+id);
  }
}
