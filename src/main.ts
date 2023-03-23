import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { getConnection } from './config/redis';
import { VIDEO_QUEUE } from './config/queue';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import bodyParser from 'body-parser';
const Queue = require("bull");
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    cors: true
  });

  app.use(bodyParser.json({limit: '10mb'}));
  app.use(bodyParser.urlencoded({extended:true, limit: '10mb'}));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const bullAdapter = new ExpressAdapter();
  bullAdapter.setBasePath('/bull-board');
  const redis = getConnection();
  createBullBoard({
      queues: [new BullAdapter(new Queue(VIDEO_QUEUE, {redis}))],
      serverAdapter: bullAdapter,
  });
  app.use('/bull-board', bullAdapter.getRouter());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3003);
}
bootstrap();
