import { Article } from './entities/article.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    return year + '-' + month + '-' + date;
  }

  async findAll() {
    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.postedAt <= :today', {
        today: this.getToday(),
      })
      .orderBy('article.postedAt', 'DESC')
      .limit(6)
      .getMany();
    return articles;
  }
}
