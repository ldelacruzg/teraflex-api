import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';

@Controller('notification-token')
@ApiTags('Notification Token')
@UseGuards(JwtAuthGuard, RoleGuard)
@UseInterceptors(ResponseHttpInterceptor)
@ApiBearerAuth()
export class NotificationTokenController {
  constructor(private service: NotificationTokenService) {}

  @Post('register-device')
  @Role(RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Registrar dispositivo' })
  async registerDevice(
    @Body() data: CreateNotificationTokenDto,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    data.userId = id;

    return {
      message: await this.service.registerDevice(data),
    } as ResponseDataInterface;
  }

  @Patch('update-device/status/:device')
  @Role(RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Actualizar estado de dispositivo' })
  async updateDeviceStatus(
    @Param('device') device: string,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return {
      message: await this.service.updateStatus(device, id),
    } as ResponseDataInterface;
  }

  @Get('verify-device/:device')
  @Role(RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Verificar dispositivo' })
  async verifyDevice(@Param('device') device: string) {
    await this.service.getByDevice(device);
    return {
      message: 'Dispositivo verificado',
    } as ResponseDataInterface;
  }
}
