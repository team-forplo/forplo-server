import { Bookmark } from 'src/bookmark/entities/bookmark.entity';
import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [TypeOrmModule],
})
export class BookmarkModule {}
