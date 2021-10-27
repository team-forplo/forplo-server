import { User } from './../auth/entities/user.entity';
import { Cheering, CheeringType } from './entities/cheering.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plogging } from 'src/ploggings/entities/plogging.entity';

@Injectable()
export class CheeringService {
  constructor(
    private connection: Connection,

    @InjectRepository(Cheering)
    private cheeringRepository: Repository<Cheering>,

    @InjectRepository(Plogging)
    private ploggingRepository: Repository<Plogging>,
  ) {}

  async create(createCheeringDto: CreateCheeringDto, user: User) {
    const plogging = await this.ploggingRepository.findOne(
      createCheeringDto.ploggingId,
    );
    if (!plogging) {
      throw new NotFoundException('플로깅을 찾을 수 없습니다.');
    }
    const cheering = await this.cheeringRepository.findOne({
      type: CheeringType.HEART,
      user,
      plogging,
    });

    if (!cheering) {
      const saveCheering = await this.cheeringRepository.save({
        type: CheeringType.HEART,
        user,
        plogging,
      });
      return saveCheering;
    }
    return cheering;
  }

  async findAll(createCheeringDto: CreateCheeringDto, user: User) {
    const cheeringCount = await this.connection
      .getRepository(Cheering)
      .createQueryBuilder('cheering')
      .leftJoinAndSelect('cheering.plogging', 'plogging')
      .where('plogging.id = :id', { id: createCheeringDto.ploggingId })
      .getCount();

    const plogging = await this.ploggingRepository.findOne(
      createCheeringDto.ploggingId,
    );
    if (!plogging) {
      throw new NotFoundException('플로깅을 찾을 수 없습니다.');
    }
    const cheering = await this.cheeringRepository.findOne({
      plogging,
      user,
    });
    const isUserCheering = cheering ? true : false;
    return {
      cheeringCount,
      isUserCheering,
    };
  }

  async remove(createCheeringDto: CreateCheeringDto, user: User) {
    const plogging = await this.ploggingRepository.findOne(
      createCheeringDto.ploggingId,
    );
    if (!plogging) {
      throw new NotFoundException('플로깅을 찾을 수 없습니다.');
    }
    await this.cheeringRepository.delete({
      type: CheeringType.HEART,
      plogging,
      user,
    });
  }
}
