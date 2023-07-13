import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MultimediaService } from '../service/multimedia.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '../../security/jwt-strategy/roles.guard';

@Controller('multimedia')
@ApiTags('multimedia')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class MultimediaController {
  constructor(private service: MultimediaService) {}

  @Post('upload/file')
  // @UseInterceptors(CustomFileInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ description: 'Cargar un video o imágen' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return await this.service.saveMultimedia(file, req.user.id);
  }

  @Post('upload/online')
  @ApiOperation({ description: 'Cargar un recurso online' })
  async uploadOnline(@Body() body: { url: string }, @Req() req: any) {
    return await this.service.saveMultimediaOnline({
      ...body,
      createdById: req.user.id,
    });
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
