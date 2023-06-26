import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { Environment } from './shared/constants/environment';
import { User } from './entities/user.entity';
import { Assignment } from './entities/assignment.entity';
import { Category } from './entities/category.entity';
import { Link } from './entities/link.entity';
import { MultimediaType } from './entities/multimedia-type.entity';
import { Role } from './entities/role.entity';
import { Task } from './entities/task.entity';
import { TaskCategory } from './entities/task-category.entity';
import { TaskMultimedia } from './entities/task-multimedia.entity';
import { UserValidation } from './entities/user-validation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environment.DATABASE_HOST,
      port: Environment.DATABASE_PORT as number,
      username: Environment.DATABASE_USERNAME,
      password: Environment.DATABASE_PASSWORD,
      database: Environment.DATABASE_NAME,
      entities: [
        Assignment,
        Category,
        Link,
        MultimediaType,
        Role,
        Task,
        TaskCategory,
        TaskMultimedia,
        User,
        UserValidation,
      ],
      synchronize: true,
    }),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
