import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class SignInUserDto extends PickType(User, [
  'email',
  'password',
] as const) {}
