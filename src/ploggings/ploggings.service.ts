import { User } from './../auth/entities/user.entity';
import { Plogging } from './entities/plogging.entity';
import { Injectable } from '@nestjs/common';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { UpdatePloggingDto } from './dto/update-plogging.dto';
import { Connection, createQueryBuilder, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PloggingsService {
  constructor(
    private connection: Connection,

    @InjectRepository(Plogging)
    private ploggingRepository: Repository<Plogging>,
  ) {}

  async create(createPloggingDto: CreatePloggingDto, user: User) {
    const plogging = await this.ploggingRepository.save({
      ...createPloggingDto,
      user,
    });
    return plogging;
  }

  async uploadProfileImage(file: any) {
    const imageUrl = `https://forplo-bucket.s3.ap-northeast-2.amazonaws.com/${file.key}`;
    return imageUrl;
  }

  async findAll(location: string) {
    if (location) {
      const ploggings = await this.connection
        .getRepository(Plogging)
        .createQueryBuilder('plogging')
        .where('plogging.isPublic = :isPublic', { isPublic: true })
        .andWhere('plogging.location like :location', {
          location: `%${location}%`,
        })
        .orderBy('plogging.createdAt', 'DESC')
        .leftJoinAndSelect('plogging.user', 'user')
        .select('plogging.id')
        .addSelect('plogging.location')
        .addSelect('plogging.distance')
        .addSelect('plogging.time')
        .addSelect('plogging.imageUrl')
        .addSelect('plogging.memo')
        .addSelect('plogging.createdAt')
        .addSelect('user.id')
        .addSelect('user.nickname')
        .addSelect('user.profileImageUrl')
        .getRawMany();
      return ploggings;
    } else {
      const ploggings = await this.connection
        .getRepository(Plogging)
        .createQueryBuilder('plogging')
        .where('plogging.isPublic = :isPublic', { isPublic: true })
        .orderBy('plogging.createdAt', 'DESC')
        .leftJoinAndSelect('plogging.user', 'user')
        .select('plogging.id')
        .addSelect('plogging.location')
        .addSelect('plogging.distance')
        .addSelect('plogging.time')
        .addSelect('plogging.imageUrl')
        .addSelect('plogging.memo')
        .addSelect('plogging.createdAt')
        .addSelect('user.id')
        .addSelect('user.nickname')
        .addSelect('user.profileImageUrl')
        .getRawMany();
      return ploggings;
    }
  }

  async findAllMy(user: User) {
    const ploggings = await this.connection
      .getRepository(Plogging)
      .createQueryBuilder('plogging')
      .where('plogging.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('plogging.user', 'user')
      .select('plogging.id')
      .addSelect('plogging.location')
      .addSelect('plogging.distance')
      .addSelect('plogging.time')
      .addSelect('plogging.imageUrl')
      .addSelect('plogging.memo')
      .addSelect('plogging.createdAt')
      .addSelect('user.id')
      .addSelect('user.nickname')
      .addSelect('user.profileImageUrl')
      .getRawMany();
    return ploggings;
  }

  findOne(id: number) {
    return `This action returns a #${id} plogging`;
  }

  update(id: number, updatePloggingDto: UpdatePloggingDto) {
    return `This action updates a #${id} plogging`;
  }

  async remove(id: number) {
    await this.ploggingRepository.delete(id);
  }
}
