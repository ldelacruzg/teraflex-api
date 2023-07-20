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
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MultimediaService } from '../service/multimedia.service';
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

@Controller('multimedia')
@ApiTags('multimedia')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class MultimediaController {
  constructor(private service: MultimediaService) {}

  @Post('upload/files')
  @Role(RoleEnum.THERAPIST)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: uploadMultimediaDto,
    description: 'Cargar uno o varios videos y/o imágenes',
  })
  @ApiOperation({ summary: 'Cargar uno o varios videos y/o imágenes' })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Body() body: uploadMultimediaDto,
  ) {
    return {
      data: await this.service.saveMultimedia(files, body, req.user.id),
      message: insertSucessful('Recurso/s'),
    } as ResponseDataInterface;
  }

  @Post('upload/online')
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Cargar un recurso online' })
  @ApiBody({
    type: [CreateLinkDto],
    description: 'Cargar uno o varios recursos online',
  })
  async uploadOnline(@Body() body: CreateLinkDto[], @Req() req) {
    for (const element of body) {
      element.createdById = req.user.id;
    }

    return {
      data: await this.service.saveMultimediaOnline(body),
      message: insertSucessful('Recurso/s'),
    } as ResponseDataInterface;
  }

  @Get('download/:id')
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  @ApiOperation({ summary: 'Descargar un recurso' })
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: any) {
    const file = await this.service.getMultimedia(id);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename= ${file.name}`,
      'x-processed-filename': `${file.name}`,
    });
    res.send(file.buffer);
  }

  @Get('all')
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({
    summary: 'Obtener todos los recursos públic y creados por el usuario',
  })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  async getAll(@Req() req: any, @Query('status') status: boolean) {
    return {
      data: await this.service.getByUserAndPublic(req.user.id, status),
    } as ResponseDataInterface;
  }

  @Put('update/:id')
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
  @Role(RoleEnum.THERAPIST)
  @ApiOperation({ summary: 'Actualizar el estado de un recurso' })
  async updateStatus(@Param('id', ParseIntPipe) id: number) {
    return {
      message: await this.service.updateStatus(id),
    } as ResponseDataInterface;
  }
}
