import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DurationInterceptor } from './duration/duration.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      //forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new DurationInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Books API with PLB')
    .setVersion('1.0')
    .setDescription('A library API for Books managing')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  await app.listen(3000);
}
bootstrap();
