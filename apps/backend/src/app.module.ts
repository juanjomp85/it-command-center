import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [], // ¡Este array debe estar completamente vacío por ahora!
  controllers: [TasksController],
  providers: [TasksService],
})
export class AppModule {}