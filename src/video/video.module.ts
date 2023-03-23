import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoController } from './video.controller';
import { VideoProcessor } from './video.processor';
import { VIDEO_QUEUE } from 'src/config/queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: VIDEO_QUEUE,
    }),
  ],
  controllers: [VideoController],
  providers: [VideoProcessor],
})
export class VideoModule {}