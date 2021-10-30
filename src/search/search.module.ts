import { BookmarkModule } from './../bookmark/bookmark.module';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), BookmarkModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
