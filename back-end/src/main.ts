import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1/')

    app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(process.env.APP_PORT || 8000);
  
}
bootstrap();
