import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PloggingsService } from 'src/ploggings/ploggings.service';
import { Repository } from 'typeorm';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';

@Injectable()
export class AccessoriesService {
  constructor(
    private readonly ploggingService: PloggingsService,

    @InjectRepository(Accessory)
    private accessoryRepository: Repository<Accessory>,
  ) {}

  async findOne(user: User) {
    const accessory = await user.accessory;
    const totalCount = await this.ploggingService.findTotalCount(user);
    return {
      ...accessory,
      totalCount,
    };
  }

  async update(user: User, updateAccessoryDto: UpdateAccessoryDto) {
    const accessory = await user.accessory;
    if (!accessory) {
      throw new NotFoundException('악세사리가 없습니다');
    }
    const { head, face, hand } = updateAccessoryDto;
    accessory.head = head;
    accessory.face = face;
    accessory.hand = hand;
    const saveAccessory = await this.accessoryRepository.save(accessory);
    return saveAccessory;
  }
}
