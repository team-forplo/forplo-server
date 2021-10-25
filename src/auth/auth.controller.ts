import { User } from './entities/user.entity';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { SignInUserDto } from './dto/signin-user.dto';
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
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('auth')
@UseInterceptors(SuccessInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('accesskey')
  @ApiResponse({
    status: 200,
    description: '회원 정보 조회 성공',
  })
  @ApiResponse({
    status: 401,
    description: '회원 정보 조회 실패',
  })
  @ApiOperation({ summary: '회원 정보 조회' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findOne(@CurrentUser() user: User) {
    const { id, email, nickname, profileImageUrl } = user;
    return {
      message: '회원 정보 조회 성공',
      data: {
        id,
        email,
        nickname,
        profileImageUrl,
      },
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Post('/upload')
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      dynamicPath: 'profile',
      randomFilename: true,
      thumbnail: { suffix: 'thumb', width: 240, height: 240 },
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
    description: '프로필 이미지 업로드 성공',
  })
  @ApiOperation({ summary: '프로필 이미지 업로드' })
  async uploadProfileImage(@UploadedFile() file: any) {
    const imageUrl = await this.authService.uploadProfileImage(file);
    return {
      message: '이미지 업로드 성공',
      data: {
        imageUrl,
      },
    };
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

  @ApiResponse({
    status: 201,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/signin')
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const token = await this.authService.signIn(signInUserDto);
    return {
      message: '로그인 성공',
      data: token,
    };
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

  @ApiResponse({
    status: 201,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 400,
    description: '입력값 부족',
  })
  @ApiResponse({
    status: 401,
    description: '로그인 실패',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('/signin')
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const token = await this.authService.signIn(signInUserDto);
    return {
      message: '로그인 성공',
      data: token,
    };
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
    status: 200,
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
}
}
