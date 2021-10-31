import { BookmarkModule } from './../bookmark/bookmark.module';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), forwardRef(() => BookmarkModule)],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
