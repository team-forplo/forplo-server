import { SearchModule } from './../search/search.module';
import { Bookmark } from 'src/bookmark/entities/bookmark.entity';
import { forwardRef, Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    forwardRef(() => SearchModule),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [TypeOrmModule, BookmarkService],
})
export class BookmarkModule {}
