import { SignInUserDto } from './dto/signin-user.dto';
import { Challenge } from './../challenges/entities/challenge.entity';
import { Accessory } from './../accessories/entities/accessory.entity';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private connection: Connection,

    private jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,

    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
  ) {}

  async findEmail(email: string) {
    const isUserExist = await this.userRepository.findOne({ email });
    if (isUserExist) {
      throw new ConflictException('이미 사용하고 있는 이메일입니다.');
    }
  }

  async findNickname(nickname: string) {
    const isUserExist = await this.userRepository.findOne({ nickname });
    if (isUserExist) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다.');
    }
  }

  async uploadProfileImage(file: any) {
    const imageUrl = `https://forplo-bucket.s3.ap-northeast-2.amazonaws.com/${file.key}`;
    return imageUrl;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password, nickname, profileImageUrl } = createUserDto;

    await this.findEmail(email);
    await this.findNickname(nickname);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let user;
    try {
      const accessory = await this.accessoryRepository.create();
      await queryRunner.manager.save(accessory);

      const challenge = await this.challengeRepository.create({
        publicTransportation: 0,
        plug: 0,
        cleanTable: 0,
        tumbler: 0,
        separateCollection: 0,
        shoppingBasket: 0,
      });
      await queryRunner.manager.save(challenge);

      user = this.userRepository.create({
        email,
        password: hashedPassword,
        nickname,
        profileImageUrl,
        accessory: accessory,
        challenge: challenge,
      });
      user = await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('회원가입 실패');
    } finally {
      await queryRunner.release();
    }
    return user;
  }

  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('아직 포플러에 가입하지 않으셨어요!');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('비밀번호가 잘못되었어요.');
    }

    const payload = { email: email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    const { nickname, profileImageUrl } = updateUserDto;
    if (nickname === user.nickname) {
      return user;
    }
    await this.findNickname(nickname);

    user.nickname = nickname;
    user.profileImageUrl = profileImageUrl;
    const updateUser = await this.userRepository.save(user);
    return updateUser;
  }

  async remove(user: User) {
    await this.userRepository.delete(user.id);
  }
}
