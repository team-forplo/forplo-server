import { Cheering } from './entities/cheering.entity';
import { Injectable } from '@nestjs/common';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { UpdateCheeringDto } from './dto/update-cheering.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CheeringService {
  constructor(
    @InjectRepository(Cheering)
    private cheeringRepository: Repository<Cheering>,
  ) {}

  create(createCheeringDto: CreateCheeringDto) {
    return 'This action adds a new cheering';
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
