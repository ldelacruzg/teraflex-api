import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../../controllers/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@activities/controllers/category/dto/update-category.dto';
import { TaskCategory } from '@/entities/task-category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(TaskCategory)
    private taskCategoryRepository: Repository<TaskCategory>,
  ) {}

  async getAllCategories(options: { isActive?: boolean }) {
    // Consulta las categorias
    return this.categoryRepository.find({
      where: {
        status: options.isActive,
      },
    });
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

  async getTotalTaskForEachCategory() {
    const query = await this.categoryRepository
      .createQueryBuilder('category')
      .select([
        'category.name as "categoryName"',
        'coalesce(count(task.id), 0) as "totalTask"',
      ])
      .leftJoin(
        TaskCategory,
        'task_category',
        'task_category.categoryId = category.id',
      )
      .leftJoin('task_category.task', 'task')
      .groupBy('category.name')
      .getRawMany();

    return query.map((item) => ({
      ...item,
      totalTask: Number(item.totalTask),
    }));
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
