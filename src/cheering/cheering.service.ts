import { Injectable } from '@nestjs/common';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { UpdateCheeringDto } from './dto/update-cheering.dto';

@Injectable()
export class CheeringService {
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
