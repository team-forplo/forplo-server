import { SearchService } from './../search/search.service';
import { Bookmark, BookmarkType } from 'src/bookmark/entities/bookmark.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class BookmarkService {
  constructor(
    private connection: Connection,

    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto, user: User) {
    const { type, contentId } = createBookmarkDto;

    const bookmark = await this.bookmarkRepository.findOne({
      type,
      contentId,
      user,
    });
    if (!bookmark) {
      const saveBookmark = await this.bookmarkRepository.save({
        type,
        contentId,
        user,
      });
      return saveBookmark;
    }
    return bookmark;
  }

  async findOne(contentId: number, user: User) {
    const bookmark = await this.bookmarkRepository.findOne({
      contentId,
      user,
    });
    return bookmark;
  }

  async remove(createBookmarkDto: CreateBookmarkDto, user: User) {
    const { type, contentId } = createBookmarkDto;

    await this.bookmarkRepository.delete({
      type,
      contentId,
      user,
    });
  }
}
