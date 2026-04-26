// apps/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👉 AÑADE ESTA LÍNEA PARA PERMITIR PETICIONES DEL FRONTEND
  app.enableCors(); // ¡Vital que esto siga aquí!
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Cambiamos al puerto 4000 para que Next.js se quede el 3000 en paz
  await app.listen(4000); 
}
bootstrap();