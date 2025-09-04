import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import {
  ApiBody, ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ThreadService } from './thread.service';
import { UserService } from '../user/user.service';
import { CreateThreadDto, CreateThreadWithFilesDto } from './dto/create-thread.dto';
import { ThreadResponseDto } from './dto/thread-response.dto';
import { LikeInfoDto } from './dto/like-info.dto';
import { LikeService } from '../like/like.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';
import { MinioService } from '../minio/minio.service';

@ApiTags('thread')
@Controller('thread')
export class ThreadController {
  constructor(
    private readonly threadService: ThreadService,
    private readonly userService: UserService,
    private readonly likeService: LikeService,
    private readonly minioService: MinioService,
  ) {
  }

  @Post()
  @ApiOperation({ summary: 'Create a new thread' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data for creating a thread + files',
    type: CreateThreadWithFilesDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Thread successfully created',
    type: ThreadResponseDto,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './tmp',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, ext);
          cb(null, `${baseName}-${Date.now()}${ext}`);
        },
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_UPLOAD_SIZE ?? '10', 10) * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const mime = file.mimetype;
        if (mime.startsWith('image/') || mime.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only image or video files are allowed'),
            false,
          );
        }
      },
    }),
  )
  async createThread(
    @Req() req: Request,
    @Body() createThreadDto: CreateThreadDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ThreadResponseDto> {

    const userId = this.userService.getUserIdFromRequest(req);


    const createdThread = await this.threadService.createThread(
      createThreadDto.text,
      userId,
    );

    if (files && files.length > 0) {
      const filePathsInMinio: string[] = [];

      for (const file of files) {
        try {
          const fileBuffer = fs.readFileSync(file.path);

          const fileNameInMinio = await this.minioService.uploadFile(
            fileBuffer,
            file.filename,
            file.mimetype,
          );
          filePathsInMinio.push(fileNameInMinio);
        } finally {
          fs.unlinkSync(file.path);
        }
      }

      if (filePathsInMinio.length > 0) {
        await this.threadService.addFilesToThread(
          createdThread.id,
          filePathsInMinio,
        );
      }
    }

    return this.threadService.getThreadById(createdThread.id, userId);
  }


  @Get(':id/isop')
  @ApiOperation({ summary: 'Check whether the user is the author of the thread' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  @ApiResponse({ status: 200, description: 'Returns isOp flag' })
  async isOp(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ isOp: boolean }> {
    const userId = this.userService.getUserIdFromRequest(req);
    const isOp = await this.threadService.checkIsOp(id, userId);
    return { isOp };
  }

  @Patch(':id/like')
  @ApiOperation({ summary: 'Like or unlike a thread (toggle)' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the new like count and isLiked flag',
    type: LikeInfoDto,
  })
  async toggleLike(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<LikeInfoDto> {
    const userId = this.userService.getUserIdFromRequest(req);
    return this.likeService.toggleLike('thread', id, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get thread data' })
  @ApiParam({ name: 'id', description: 'Thread ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns thread data',
    type: ThreadResponseDto,
  })
  async getThreadById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ThreadResponseDto> {
    const userId = this.userService.getUserIdFromRequest(req);
    await this.threadService.clickThread(id, userId);
    return this.threadService.getThreadById(id, userId);
  }
}
