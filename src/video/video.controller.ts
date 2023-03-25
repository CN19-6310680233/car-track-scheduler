import { BadRequestException, Body, Controller, FileTypeValidator, Get, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Post, UploadedFile, UseInterceptors, Version } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VIDEO_QUEUE } from 'src/config/queue';
import { ApiConsumes } from '@nestjs/swagger';
import { VideoDTO } from './video.dto';
import * as path from 'path';
import * as fs from 'fs';
const crypto = require('crypto')

@Controller()
export class VideoController {
  constructor(@InjectQueue(VIDEO_QUEUE) private videoQueue: Queue) {}

    @Post('upload')
    @Version('1')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo(
        @Body()
        data: VideoDTO,
        // @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({fileType: /(avi|mov|wmv|mp4)/}).build())
        @UploadedFile()
        file: Express.Multer.File
    ) {
        const fileExt = path.extname(file.originalname);
        const mimeType = file.mimetype;
        if(!mimeType.startsWith('video/')) throw new BadRequestException(["File is not video type"]);
        const fileName = `${crypto.randomUUID()}${fileExt}`;
        const skipBuildFolder = __dirname.includes('dist') ? '..' : '';
        const uploadsDir = path.join(__dirname, '..', skipBuildFolder, 'public', 'uploads');

        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

        // Move the uploaded file to a new location
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, file.buffer); 

        const uploadedPath = `uploads/${fileName}`;

        // Add job to queue
        return this.videoQueue.add('processVideo', {
            filePath: uploadedPath
        });
    }

    @Get('result/:jobId')
    @Version('1')
    async getResult(
        @Param('jobId', ParseIntPipe) jobId: number
    ) {
        const job = await this.videoQueue.getJob(jobId);

        return {
            id: job.id,
            attempts: job.attemptsMade,
            result: job.returnvalue,
            timestamp: job.timestamp
        };
    }
}