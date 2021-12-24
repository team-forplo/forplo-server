import {
  Controller,
  Get,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { AccessoriesService } from './accessories.service';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';

@Controller('accessories')
@ApiBearerAuth('accesskey')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SuccessInterceptor)
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: '악세사리 조회 성공',
  })
  @ApiOperation({ summary: '악세사리 조회' })
  async findOne(@CurrentUser() user: User) {
    const accessory = await this.accessoriesService.findOne(user);
    return {
      message: '악세사리 조회 성공',
      data: accessory,
    };
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: '악세사리 변경 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiOperation({ summary: '악세사리 변경' })
  async update(
    @CurrentUser() user: User,
    @Body() updateAccessoryDto: UpdateAccessoryDto,
  ) {
    const accessory = await this.accessoriesService.update(
      user,
      updateAccessoryDto,
    );
    return {
      message: '악세사리 변경 성공',
      data: accessory,
    };
  }
}
