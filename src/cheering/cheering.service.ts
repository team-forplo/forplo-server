import { User } from './../auth/entities/user.entity';
import { Cheering, CheeringType } from './entities/cheering.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { UpdateCheeringDto } from './dto/update-cheering.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plogging } from 'src/ploggings/entities/plogging.entity';

@Injectable()
export class CheeringService {
  constructor(
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

  findAll() {
    return `This action returns all cheering`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cheering`;
  }

  update(id: number, updateCheeringDto: UpdateCheeringDto) {
    return `This action updates a #${id} cheering`;
  }

  remove(id: number) {
    return `This action removes a #${id} cheering`;
  }
}
