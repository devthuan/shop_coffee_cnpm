import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { plainToInstance } from 'class-transformer';
import { Notification } from './entities/notification.entity';
import { AuthGuardCustom } from 'src/auth/auth.guard';
import { CommonException } from 'src/common/exception';
import { Permissions } from 'src/auth/permission.decorator';
import { PermissionsGuard } from 'src/auth/permisson.guard';

@Controller('notification')
@UseGuards(AuthGuardCustom)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(PermissionsGuard)
  @Permissions("CREATE_NOTIFICATION")
  @Post()
  create(@Req() request: Request, @Body() createNotificationDto: CreateNotificationDto) {
    console.log(createNotificationDto.roleId)
    try {
      if(createNotificationDto.typeSend === "role" && !createNotificationDto.roleId){
      throw new BadRequestException("roleId is required for role type notification")
    }
     if(createNotificationDto.typeSend === "user" && !createNotificationDto.userId){
      throw new BadRequestException("userId is required for user type notification")
    }
    createNotificationDto.accountId = request['user'].id
    return this.notificationService.create(createNotificationDto);
    } catch (error) {
      CommonException.handle(error)
    }
  }

  @UseGuards(PermissionsGuard)
  @Permissions("GET_NOTIFICATIONS")
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>
  ) {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit > 100? limit = 100 : limit;
    const data = this.notificationService.findAll(search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Notification, data);
  }
  @UseGuards(PermissionsGuard)
  @Permissions("GET_USER_NOTIFICATIONS")
  @Get('user')
  allNotificationByAccount(
    @Req() request: Request,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() query: Record<string, any>

  ) {
    const { page: _page, limit: _limit, sortBy: _sortBy, sortOrder: _sortOrder, ...filters } = query;
    limit > 100? limit = 100 : limit;
    let accountId = request['user'].id;
    const data = this.notificationService.allNotificationByAccount(accountId, search, page, limit, sortBy, sortOrder, filters);
    return plainToInstance(Notification, data);
  }

  // @UseGuards(PermissionsGuard)
  // @Permissions("GET_USER_NOTIFICATIONS")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("UPDATE_NOTIFICATION")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.updateNoti(id, updateNotificationDto);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("MARK_NOTIFICATION_READ")
  @Patch('read/:id')
  readNotification(@Param('id') id: string) {
    return this.notificationService.readNotification(id);
  }

  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_NOTIFICATION")
  @Delete(':id')
  deleteSoft(@Param('id') id: string) {
    return this.notificationService.deleteSoftNotification(id);
  }
  @UseGuards(PermissionsGuard)
  @Permissions("DELETE_USER_NOTIFICATION")
  @Delete('/user/:id')
  deleteSoftUser(@Req() request: Request, @Param('id') id: string) {
    let accountId = request['user'].id
    return this.notificationService.deleteSoftUser(id, accountId);
  }
}
