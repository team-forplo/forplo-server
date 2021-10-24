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

  @Post('/email')
  async findEmail(@Body() emailUserDto: EmailUserDto) {
    await this.authService.findEmail(emailUserDto.email);
    return { message: '사용 가능한 이메일입니다.' };
  }

  @Get('/nickname/:nickname')
  async findNickname(@Param('nickname') nickname: string) {
    await this.authService.findNickname(nickname);
    return { message: '사용 가능한 닉네임입니다.' };
  }

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
