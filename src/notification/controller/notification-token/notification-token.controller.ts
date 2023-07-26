import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { NotificationTokenService } from '@notification/service/notification-token/notification-token.service';
import { CreateNotificationTokenDto } from '@notification/controller/notification-token/dtos/create-notification-token.dto';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';

@Controller('notification-token')
@ApiTags('Notification Token')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class NotificationTokenController {
  constructor(private service: NotificationTokenService) {}

  @Post('register-device')
  @ApiOperation({ summary: 'Registrar dispositivo' })
  async registerDevice(@Body() data: CreateNotificationTokenDto, @Req() req) {
    data.userId = req.user.id;

    return {
      message: await this.service.registerDevice(data),
    } as ResponseDataInterface;
  }

  @Patch('update-device/status/:device')
  @ApiOperation({ summary: 'Actualizar estado de dispositivo' })
  async updateDeviceStatus(@Param('device') device: string, @Req() req) {
    return {
      message: await this.service.updateStatus(device, req.user.id),
    } as ResponseDataInterface;
  }
}
