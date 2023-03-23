import { ApiProperty } from "@nestjs/swagger";

export class VideoDTO {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File
}