import { EmailUserDto } from './dto/email-user.dto';
import { SuccessInterceptor } from './../common/interceptors/success.interceptor';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @ApiResponse({
    status: 201,
    description: '사용 가능한 이메일',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 409,
    description: '이메일 중복',
  })
  @ApiOperation({ summary: '이메일 중복 검사' })
  @Post('/email')
  async findEmail(@Body() emailUserDto: EmailUserDto) {
    await this.authService.findEmail(emailUserDto.email);
    return { message: '사용 가능한 이메일입니다.' };
  }

  @ApiResponse({
    status: 201,
    description: '사용 가능한 닉네임',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 409,
    description: '닉네임 중복',
  })
  @ApiOperation({ summary: '닉네임 중복 검사' })
  @Get('/nickname/:nickname')
  async findNickname(@Param('nickname') nickname: string) {
    await this.authService.findNickname(nickname);
    return { message: '사용 가능한 닉네임입니다.' };
  }

  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 409,
    description: '이메일 or 닉네임 중복',
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return {
      message: '회원가입 성공',
      data: {
        id: user.id,
      },
    };
  }
}
