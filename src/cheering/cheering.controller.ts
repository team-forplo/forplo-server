import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CheeringService } from './cheering.service';
import { CreateCheeringDto } from './dto/create-cheering.dto';
import { UpdateCheeringDto } from './dto/update-cheering.dto';

@Controller('cheering')
export class CheeringController {
  constructor(private readonly cheeringService: CheeringService) {}

  @Post()
  create(@Body() createCheeringDto: CreateCheeringDto) {
    return this.cheeringService.create(createCheeringDto);
  }

  @Get()
  findAll() {
    return this.cheeringService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cheeringService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheeringDto: UpdateCheeringDto,
  ) {
    return this.cheeringService.update(+id, updateCheeringDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cheeringService.remove(+id);
  }
}
