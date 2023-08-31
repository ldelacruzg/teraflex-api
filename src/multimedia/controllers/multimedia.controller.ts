import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MultimediaService } from '../services/multimedia.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { CreateLinkDto, uploadMultimediaDto } from './dtos/create-link.dto';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { UpdateLinkDto } from './dtos/update-link.dto';
import { insertSucessful } from '@shared/constants/messages';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { CurrentUser } from '@security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { Response } from 'express';

@Controller('multimedia')
@ApiTags('Multimedia')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class MultimediaController {
  constructor(private service: MultimediaService) {}

  @Post('upload/files')
  @Role(RoleEnum.THERAPIST)
  @UseInterceptors(FilesInterceptor('files'), ResponseHttpInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: uploadMultimediaDto,
    description: 'Cargar uno o varios videos y/o imágenes',
  })
  @ApiOperation({ summary: 'Cargar uno o varios videos y/o imágenes' })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: InfoUserInterface,
    @Body() body: uploadMultimediaDto,
  ) {
    return {
      data: await this.service.saveMultimedia(files, body, user.id),
      message: insertSucessful('Recurso/s'),
    } as ResponseDataInterface;
  }

  @Post('upload/online')
  @Role(RoleEnum.THERAPIST)
  @UseInterceptors(ResponseHttpInterceptor)
  @ApiOperation({ summary: 'Cargar un recurso online' })
  @ApiBody({
    type: [CreateLinkDto],
    description: 'Cargar uno o varios recursos online',
  })
  async uploadOnline(
    @Body() body: CreateLinkDto[],
    @CurrentUser() user: InfoUserInterface,
  ) {
    for (const element of body) {
      element.createdById = user.id;
    }

    return {
      data: await this.service.saveMultimediaOnline(body),
      message: insertSucessful('Recurso/s'),
    } as ResponseDataInterface;
  }

  @Get('download/:id')
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Descargar un recurso' })
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const file = await this.service.getMultimedia(id);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename= ${file.name}`,
      'x-processed-filename': `${file.name}`,
    });
    res.send(file.buffer);
  }

  @Get('all')
  @UseInterceptors(ResponseHttpInterceptor)
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({
    summary: 'Obtener todos los recursos públic y creados por el usuario',
  })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(
    @CurrentUser() user: InfoUserInterface,
    @Query('status') status: boolean,
  ) {
    return {
      data: await this.service.getByUserAndPublic(user.id, status),
    } as ResponseDataInterface;
  }

  @Put('update/:id')
  @UseInterceptors(ResponseHttpInterceptor)
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Actualizar un recurso' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateLinkDto,
  ) {
    return {
      message: await this.service.update(id, body),
    } as ResponseDataInterface;
  }

  @Patch('update/:id/status')
  @UseInterceptors(ResponseHttpInterceptor)
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Actualizar el estado de un recurso' })
  async updateStatus(@Param('id', ParseIntPipe) id: number) {
    return {
      message: await this.service.updateStatus(id),
    } as ResponseDataInterface;
  }
}
