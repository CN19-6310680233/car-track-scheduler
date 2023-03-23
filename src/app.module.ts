import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { getConnection } from './config/redis';
import { VideoModule } from './video/video.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => {
        const connection = getConnection();
        return {redis: connection}
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),

    VideoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
