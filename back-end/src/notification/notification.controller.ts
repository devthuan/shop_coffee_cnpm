import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { plainToInstance } from 'class-transformer';
import { Notification } from './entities/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC'
  ) {
    const data = this.notificationService.findAll(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Notification, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.notificationService.deleteSoft(id);
  }
}
