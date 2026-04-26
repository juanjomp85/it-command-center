import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDtoImpl } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Gestión de Tareas')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea en el Backlog' })
  @ApiResponse({ status: 201, description: 'La tarea ha sido creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Bad Request).' })
  async create(@Body() createTaskDto: CreateTaskDtoImpl) {
    const mockCreatorId = '123e4567-e89b-12d3-a456-426614174000';
    return this.tasksService.create(createTaskDto, mockCreatorId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas del sistema' })
  @ApiResponse({ status: 200, description: 'Lista de tareas devuelta con éxito.' })
  async findAll() {
    return this.tasksService.findAll();
  }
}
