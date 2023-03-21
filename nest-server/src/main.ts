import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MExcetionFilter } from './common/filter/exception.filter';
import { Response } from './common/interceptors/response.interceptors';
import { File } from './config/app.config';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('途中项目接口')
    .setDescription('个人项目')
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);
  app.useGlobalInterceptors(new Response());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MExcetionFilter());
  app.useStaticAssets(File.imageFilePath, {
    prefix: File.imageAccessProffix,
  });
  // app.useStaticAssets(File.excelFilePath, {
  //   prefix: File.excelAccessProffix,
  // });
  app.useStaticAssets(File.avatarFilePath, {
    prefix: File.avatarAccessProffix,
  });
  await app.listen(3000);
}
bootstrap();
