import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { NotificationTokenService } from '@notification/service/notification-token/notification-token.service';
import { CreateNotificationTokenDto } from '@notification/controller/notification-token/dtos/create-notification-token.dto';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { Request } from 'express';

@Controller('notification-token')
@ApiTags('Notification Token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Role(RoleEnum.PATIENT)
@UseInterceptors(ResponseHttpInterceptor)
@ApiBearerAuth()
export class NotificationTokenController {
  constructor(private service: NotificationTokenService) {}

  @Post('register-device')
  @ApiOperation({ summary: 'Registrar dispositivo' })
  async registerDevice(
    @Body() data: CreateNotificationTokenDto,
    @Req() req: any,
  ) {
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

  @Get('verify-device/:device')
  @ApiOperation({ summary: 'Verificar dispositivo' })
  async verifyDevice(@Param('device') device: string) {
    await this.service.getByDevice(device);
    return {
      message: 'Dispositivo verificado',
    } as ResponseDataInterface;
  }
}
