import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PloggingsService } from './ploggings.service';
import { CreatePloggingDto } from './dto/create-plogging.dto';
import { UpdatePloggingDto } from './dto/update-plogging.dto';

@Controller('ploggings')
export class PloggingsController {
  constructor(private readonly ploggingsService: PloggingsService) {}

  @Post()
  create(@Body() createPloggingDto: CreatePloggingDto) {
    return this.ploggingsService.create(createPloggingDto);
  }

  @Get()
  findAll() {
    return this.ploggingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ploggingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePloggingDto: UpdatePloggingDto,
  ) {
    return this.ploggingsService.update(+id, updatePloggingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ploggingsService.remove(+id);
  }
}
