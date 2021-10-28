import { User } from 'src/auth/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
  ) {}

  create(createChallengeDto: CreateChallengeDto) {
    return 'This action adds a new challenge';
  }

  findAll() {
    return `This action returns all challenges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} challenge`;
  }

  isSameDate(updatedAt: Date) {
    const today = new Date();
    console.log(today.toString());
    console.log(updatedAt.toUTCString());

    if (
      today.getFullYear() === updatedAt.getUTCFullYear() &&
      today.getMonth() === updatedAt.getUTCMonth() &&
      today.getDate() === updatedAt.getUTCDate()
    ) {
      return true;
    } else {
      return false;
    }
  }

  async update(user: User, update: UpdateChallengeDto) {
    const challenge = await user.challenge;
    if (!challenge) {
      throw new NotFoundException('챌린지가 없습니다');
    }

    if (this.isSameDate(challenge.updatedAt)) {
      if (challenge.updatedAt.toUTCString() != user.updatedAt.toUTCString()) {
        throw new BadRequestException('챌린지 인증은 1일 1회만 가능합니다.');
      }
    }
    const {
      publicTransportation,
      plug,
      cleanTable,
      tumbler,
      separateCollection,
      shoppingBasket,
    } = challenge;

    challenge.publicTransportation =
      publicTransportation + Number(update.publicTransportation);
    challenge.plug = plug + Number(update.plug);
    challenge.cleanTable = cleanTable + Number(update.cleanTable);
    challenge.tumbler = tumbler + Number(update.tumbler);
    challenge.separateCollection =
      separateCollection + Number(update.separateCollection);
    challenge.shoppingBasket = shoppingBasket + Number(update.shoppingBasket);

    const saveChallenge = await this.challengeRepository.save(challenge);
    return saveChallenge;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
  }
}
