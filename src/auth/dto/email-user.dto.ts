import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
