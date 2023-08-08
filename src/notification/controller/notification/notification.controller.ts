import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from '@notification/service/notification/notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';

@Controller('notification')
@ApiTags('Notification')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ResponseHttpInterceptor)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('all')
  @Role(RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Obtener todas las notifications' })
  async getAll(@CurrentUser() { id }: InfoUserInterface) {
    return {
      data: await this.notificationService.getNotifications(id),
    } as ResponseDataInterface;
  }

  @Delete('delete/:id')
  @Role(RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Desactivar la notificación' })
  async deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return {
      message: await this.notificationService.deleteNotification(id),
    } as ResponseDataInterface;
  }
}
