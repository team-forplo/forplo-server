import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  profileImageUrl: string;
}
