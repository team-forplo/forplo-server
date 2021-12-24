import { User } from './../auth/entities/user.entity';
import { Plogging } from './entities/plogging.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { Connection, Repository } from 'typeorm';
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
        .addSelect('plogging.imageUrl')
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
        .addSelect('plogging.imageUrl')
        .addSelect('user.id')
        .addSelect('user.nickname')
        .addSelect('user.profileImageUrl')
        .getRawMany();
      return ploggings;
    }
  }

  async findFlagMap(user: User) {
    let flagMaps = await this.ploggingRepository
      .createQueryBuilder('plogging')
      .where('plogging.userId = :userId', { userId: user.id })
      .groupBy('plogging.firstLocation')
      .select('COUNT(plogging.firstLocation)', 'totalCount')
      .addSelect('plogging.firstLocation', 'firstLocation')
      .getRawMany();

    flagMaps = flagMaps.map((item) => {
      const { firstLocation } = item || {};
      let { totalCount } = item || {};
      totalCount = totalCount ? Number(totalCount) : totalCount;
      return {
        firstLocation,
        totalCount,
      };
    });
    return flagMaps;
  }

  async findAllMy(user: User) {
    const ploggings = await this.connection
      .getRepository(Plogging)
      .createQueryBuilder('plogging')
      .where('plogging.userId = :userId', { userId: user.id })
      .orderBy('plogging.createdAt', 'DESC')
      .leftJoinAndSelect('plogging.user', 'user')
      .select('plogging.id')
      .addSelect('plogging.location')
      .addSelect('plogging.imageUrl')
      .addSelect('user.id')
      .addSelect('user.nickname')
      .addSelect('user.profileImageUrl')
      .getRawMany();
    return ploggings;
  }

  async findSummary(user: User) {
    const summary = await this.connection
      .getRepository(Plogging)
      .createQueryBuilder('plogging')
      .where('plogging.userId = :userId', { userId: user.id })
      .select('COUNT(plogging.id)', 'totalCount')
      .addSelect('SUM(plogging.distance)', 'totalDistance')
      .addSelect('SUM(plogging.time)', 'totalTime')
      .getRawOne();
    let { totalCount, totalDistance, totalTime } = summary || {};
    totalCount = totalCount ? Number(totalCount) : 0;
    totalTime = totalTime ? Number(totalTime) : 0;
    totalDistance = totalDistance ? Number(totalDistance) : 0;
    return {
      totalCount,
      totalDistance,
      totalTime,
    };
  }

  async findOne(id: number) {
    const ploggings = await this.connection
      .getRepository(Plogging)
      .createQueryBuilder('plogging')
      .where('plogging.id = :id', { id: id })
      .leftJoinAndSelect('plogging.user', 'user')
      .select('plogging.id')
      .addSelect('plogging.location')
      .addSelect('plogging.distance')
      .addSelect('plogging.time')
      .addSelect('plogging.imageUrl')
      .addSelect('plogging.memo')
      .addSelect('plogging.isPublic')
      .addSelect('plogging.createdAt')
      .addSelect('user.id')
      .addSelect('user.nickname')
      .addSelect('user.profileImageUrl')
      .getRawOne();
    return ploggings;
  }

  async update(id: number, isPublic: boolean) {
    const plogging = await this.ploggingRepository.findOne(id);
    if (!plogging) {
      throw new NotFoundException('플로깅을 찾을 수 없습니다.');
    }
    plogging.isPublic = isPublic;
    const savePlogging = await this.ploggingRepository.save(plogging);
    return savePlogging;
  }

  async remove(id: number) {
    await this.ploggingRepository.delete(id);
  }
}
