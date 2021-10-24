import { Challenge } from './../challenges/entities/challenge.entity';
import { Accessory } from './../accessories/entities/accessory.entity';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private connection: Connection,

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

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, nickname, profileImageUrl } = createUserDto;

    await this.findEmail(email);
    await this.findNickname(nickname);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const accessory = this.accessoryRepository.create();

    const challenge = this.challengeRepository.create({
      publicTransportation: 0,
      plug: 0,
      cleanTable: 0,
      tumbler: 0,
      separateCollection: 0,
      shoppingBasket: 0,
    });

    let user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      profileImageUrl,
      accessory,
      challenge,
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(accessory);
      await queryRunner.manager.save(challenge);
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
