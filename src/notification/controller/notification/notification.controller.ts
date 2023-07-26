import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '@notification/service/notification/notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';

@Controller('notification')
@ApiTags('Notification')
@UseGuards(JwtAuthGuard, RoleGuard)
@Role(RoleEnum.PATIENT)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las notifications' })
  async getAll(@Req() req) {
    return {
      data: await this.notificationService.getNotifications(req.user.id),
    } as ResponseDataInterface;
  }

  @Post('push')
  @ApiOperation({ summary: 'Enviar notificación' })
  async pushNotification(@Req() req) {
    return await this.notificationService.sendNotification(req.user.id, {
      title: 'Notificación de prueba',
      body: 'Esta es una notificación de prueba',
    });
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Desactivar la notificación' })
  async updateStatus(@Param('id') id: number) {
    return {
      message: await this.notificationService.deleteNotification(id),
    } as ResponseDataInterface;
  }
}
