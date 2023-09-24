import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ParseIntPipe,
  Put,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from '@activities/services/category/category.service';
import { CreateCategoryDto } from '@activities/controllers/category/dto/create-category.dto';
import { JwtAuthGuard } from '@security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@security/jwt-strategy/role.enum';
import { Role } from '@security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@security/jwt-strategy/roles.guard';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseHttpInterceptor } from '@shared/interceptors/response-http.interceptor';
import { ResponseDataInterface } from '@shared/interfaces/response-data.interface';
import { ParseBoolAllowUndefinedPipe } from '@/shared/pipes/parse-bool-allow-undefined.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('categories')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'isActive', required: false })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getAllCategories(
    @Query('isActive', ParseBoolAllowUndefinedPipe)
    isActive: boolean,
  ): Promise<ResponseDataInterface> {
    return {
      message: 'Categorias obtenidas correctamente',
      data: await this.categoryService.getAllCategories({ isActive }),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataInterface> {
    return {
      message: 'Categoria obtenida correctamente',
      data: await this.categoryService.getCatgeoryById(id),
    };
  }

  @Get('query/total-task-each-category')
  @ApiOperation({ summary: 'Get total task for each category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getTotalTaskForEachCategory(): Promise<ResponseDataInterface> {
    return {
      message: 'El total de tareas por categoria se obtuvo correctamente',
      data: await this.categoryService.getTotalTaskForEachCategory(),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async createCategory(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseDataInterface> {
    // Asignar el usuario de creación
    const userLogged = req.user as InfoUserInterface;
    createCategoryDto.createdById = userLogged.id;

    // Retornar la categoria creada
    return {
      message: 'Categoria creada correctamente',
      data: await this.categoryService.createCategory(createCategoryDto),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async updateCategory(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseDataInterface> {
    // Asigna el usuario de modificación
    const userLogged = req.user as InfoUserInterface;
    updateCategoryDto.updatedById = userLogged.id;

    // Modifica la categoria
    const changedCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );

    // Retorna la categoria modificada
    return {
      message: 'Categoria modificada correctamente',
      data: changedCategory,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Detele a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async deleteCategory(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDataInterface> {
    // delete category
    const deletedCategory = await this.categoryService.deleteCategory({
      id,
      updatedById: req.user.id,
    });

    return {
      message: 'Categoria eliminada correctamente',
      data: deletedCategory,
    };
  }
}
