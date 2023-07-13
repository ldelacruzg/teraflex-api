import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
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
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../security/jwt-strategy/roles.guard';
import { CreateLinkDto, uploadMultimediaDto } from './dtos/create-link.dto';

@Controller('multimedia')
@ApiTags('multimedia')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class MultimediaController {
  constructor(private service: MultimediaService) {}

  @Post('upload/files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       files: {
  //         type: 'array',
  //         maxItems: 5,
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   },
  // })
  @ApiBody({
    type: uploadMultimediaDto,
    description: 'Cargar uno o varios videos y/o imágenes',
  })
  @ApiOperation({ description: 'Cargar uno o varios videos y/o imágenes' })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: any,
    @Body() body: uploadMultimediaDto,
  ) {
    return {
      message: await this.service.saveMultimedia(files, body, req.user.id),
    };
  }

  @Post('upload/online')
  @ApiOperation({ description: 'Cargar un recurso online' })
  async uploadOnline(@Body() body: CreateLinkDto, @Req() req: any) {
    body.createdById = req.user.id;
    return await this.service.saveMultimediaOnline(body);
  }

  @Get('download/:id')
  @ApiOperation({ description: 'Descargar un recurso' })
  async download(@Param('id') id: number, @Res() res: any) {
    const file = await this.service.getMultimedia(id);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename= ${file.name}`,
      'x-processed-filename': `${file.name}`,
    });
    res.send(file.buffer);
  }
}
