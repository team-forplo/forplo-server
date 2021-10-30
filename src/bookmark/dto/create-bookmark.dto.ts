import { PickType } from '@nestjs/swagger';
import { Bookmark } from 'src/bookmark/entities/bookmark.entity';
export class CreateBookmarkDto extends PickType(Bookmark, [
  'type',
  'contentId',
] as const) {}
