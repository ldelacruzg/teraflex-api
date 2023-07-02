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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/activity/services/category/category.service';
import { CreateCategoryDto } from 'src/activity/controllers/category/dto/create-category.dto';
import { JwtAuthGuard } from 'src/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';
import { Role } from 'src/security/jwt-strategy/roles.decorator';
import { RoleGuard } from 'src/security/jwt-strategy/roles.guard';
import { InfoUserInterface } from 'src/security/jwt-strategy/info-user.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCatgeoryById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async createCategory(
    @Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    // Asignar el usuario de creación
    const userLogged = req.user as InfoUserInterface;
    createCategoryDto.createdById = userLogged.id;

    // Retornar la categoria creada
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async updateCategory(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    // Asigna el usuario de modificación
    const userLogged = req.user as InfoUserInterface;
    updateCategoryDto.updatedById = userLogged.id;

    // Modifica la categoria
    const changedCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );

    // Retorna la categoria modificada
    return changedCategory;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Detele a category' })
  @Role(RoleEnum.ADMIN, RoleEnum.THERAPIST)
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
