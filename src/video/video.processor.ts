import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { VIDEO_QUEUE } from 'src/config/queue';

@Processor(VIDEO_QUEUE)
export class VideoProcessor {
  @Process('processVideo')
  async handleProcessVideo(job: Job<{ filePath: string }>) {
    const { data, id } = job;
    const { filePath } = data;

    // Process the video file
    for(let i = 0; i < 100; i ++) {
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000)));
      await job.progress(i)
    }
    await job.progress(100);
    // ...
    return {status: true};
  }
}