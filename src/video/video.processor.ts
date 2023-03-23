import { Processor, Process } from '@nestjs/bull';
import axios from 'axios';
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
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500)));
      await job.progress(i)
    }
    await job.progress(100);

    const webhookParams = {
      job_id: job.id,
      result: {
        frame: Math.floor(Math.random() * 200), 
        count: Math.floor(Math.random() * 100),
        file_name: filePath,
      }
    };
    const webhook = await axios.post(process.env.WEBHOOK_API_ENDPOINT, webhookParams).then(data => {
      return data.data;
    }).catch(err => null);
    
    return {
      status: true,
      webhook
    };
  }
}