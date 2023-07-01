import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/activity/controllers/task/dto/create-task.dto';
import { UpdateTaskDto } from 'src/activity/controllers/task/dto/update-task.dto';
import { Task } from 'src/entities/task.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taksRepository: Repository<Task>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async getAllTasks() {
    return this.taksRepository.find();
  }

  async getTask(id: number) {
    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la categoria
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // Devolver la tarea encontrada
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto) {
    // Crea y devuelve una nueva tarea
    return this.taksRepository.save(createTaskDto);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // Devuelve la tarea modificada
    return this.taksRepository
      .createQueryBuilder()
      .update(Task)
      .set(updateTaskDto)
      .where('id = :id', { id })
      .returning(this.retrieveEntityProperties())
      .execute();
  }

  async deleteTask(id: number) {
    // Consulta la tarea por Id
    const task = await this.taksRepository.findOneBy({
      id,
    });

    // Verifica si no existe la tarea
    if (!task) {
      throw new NotFoundException(`La tarea con Id "${id}" no existe`);
    }

    // Devuelve la tarea eliminada
    return this.taksRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .returning(this.retrieveEntityProperties())
      .execute();
  }

  private retrieveEntityProperties() {
    const taskMetadata = this.entityManager.connection.getMetadata(Task);

    const properties = taskMetadata.columns.map(
      (column) => column.propertyName,
    );

    return properties;
  }
}
