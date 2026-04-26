import { Injectable } from '@nestjs/common';
import { CreateTaskDtoImpl, TaskStatus } from './dto/create-task.dto';

type Task = CreateTaskDtoImpl & {
  id: string;
  status: TaskStatus;
  creatorId: string;
  createdAt: Date;
};

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  create(createTaskDto: CreateTaskDtoImpl, creatorId: string) {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      ...createTaskDto,
      status: TaskStatus.BACKLOG,
      creatorId,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  findAll() {
    return this.tasks;
  }
}
