import { Injectable } from '@nestjs/common';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { UpdatePloggingDto } from './dto/update-plogging.dto';

@Injectable()
export class PloggingsService {
  create(createPloggingDto: CreatePloggingDto) {
    return 'This action adds a new plogging';
  }

  findAll() {
    return `This action returns all ploggings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plogging`;
  }

  update(id: number, updatePloggingDto: UpdatePloggingDto) {
    return `This action updates a #${id} plogging`;
  }

  remove(id: number) {
    return `This action removes a #${id} plogging`;
  }
}
