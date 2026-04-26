import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDtoImpl, TaskStatus } from './dto/create-task.dto';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: CreateTaskDtoImpl, creatorId: string) {
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      status: TaskStatus.BACKLOG,
      creatorId,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
    });

    return this.taskRepository.save(newTask);
  }

  async findAll() {
    return this.taskRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
