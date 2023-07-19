import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Category } from '@entities/category.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from '../../controllers/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@activity/controllers/category/dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getAllCategories() {
    return this.categoryRepository.find();
  }

  async getCatgeoryById(id: number) {
    // Consulta la categoria por Id
    const category = await this.categoryRepository.findOneBy({
      id,
    });

    // Verifica si no existe la categoria
    if (!category) {
      throw new NotFoundException(`La categoria con Id "${id}" no existe`);
    }

    // Devuelve la categoria encontrada
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    // Consulta la categoria por el nombre
    const category = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });

    // Verifica si existe la cetegoria
    if (category) {
      throw new BadRequestException(
        `La categoría con el nombre "${category.name}" ya existe`,
      );
    }

    // Devolver la categoria creada
    return this.categoryRepository.save(createCategoryDto);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Consulta la categoria por Id
    const category = await this.categoryRepository.findOneBy({
      id,
    });

    // Verifica si no existe la categoria
    if (!category) {
      throw new NotFoundException(`La categoria con Id "${id}" no existe`);
    }

    // Devolver la categoria modificada
    return this.categoryRepository.update({ id }, updateCategoryDto);
  }

  async deleteCategory(data: { id: number; updatedById: number }) {
    const { id, updatedById } = data;

    // Consulta la categoria por Id
    const category = await this.categoryRepository.findOneBy({
      id,
    });

    // Verifica si no existe la categoria
    if (!category) {
      throw new NotFoundException(`La categoria con Id "${id}" no existe`);
    }

    // Devolver la categoria eliminada
    return this.categoryRepository.update(
      { id },
      { status: false, updatedById },
    );
  }
}
