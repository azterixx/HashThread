import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse, ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags, getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { UserService } from '../user/user.service';
import { ThreadService } from '../thread/thread.service';
import {
  CreateCommentDto,
  CreateCommentWithFilesDto,
} from './dto/create-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { LikeService } from '../like/like.service';
import { LikeInfoDto } from '../thread/dto/like-info.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { MinioService } from '../minio/minio.service';
import { PaginatedDto } from '../common/dto/pagintation.dto';

@ApiTags('comment')
@Controller('comment')
@ApiExtraModels(PaginatedDto, CommentDto)
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly threadService: ThreadService,
    private readonly likeService: LikeService,
    private readonly minioService: MinioService,
  ) {
  }


  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new comment + files (optionally)',
    type: CreateCommentWithFilesDto,
  })
  @ApiCreatedResponse({ description: 'Comment created', type: CommentDto })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './tmp',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const base = path.basename(file.originalname, ext);
          cb(null, `${base}-${Date.now()}${ext}`);
        },
      }),
      limits: {
        fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE ?? '10', 10) || 10) * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const ok = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
        cb(ok ? null : new BadRequestException('Only images or videos allowed'), ok);
      },
    }),
  )
  async createComment(
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<CommentDto> {
    const userId = this.userService.getUserIdFromRequest(req);
    if (!userId) throw new BadRequestException('User authentication required');

    const { threadId, text, replyTo } = dto;

    const isOp = await this.threadService.checkIsOp(threadId, userId);

    const normalized = text.trim().replace(/\s+/g, ' ');
    if (normalized.length === 0) throw new BadRequestException('Comment text cannot be empty');
    if (normalized.length > 500) throw new BadRequestException('Comment exceeds 500 characters');

    if (replyTo) {
      const parent = await this.commentService.findByMessageNumber(threadId, replyTo);
      if (!parent) {
        throw new BadRequestException(`No comment found with message number ${replyTo} to reply to`);
      }
    }

    const created = await this.commentService.createComment(
      threadId,
      normalized,
      replyTo,
      isOp,
    );

    const uploaded: string[] = [];
    if (files?.length) {
      for (const file of files) {
        try {
          const buffer = fs.readFileSync(file.path);
          const nameInMinio = await this.minioService.uploadFile(buffer, file.filename, file.mimetype);
          uploaded.push(nameInMinio);
        } finally {
          fs.unlinkSync(file.path);
        }
      }
      if (uploaded.length) await this.commentService.addFilesToComment(created.id, uploaded);
    }

    return {
      ...created,
      files: uploaded,
      isLiked: false,
    };
  }

  @Get(':threadId')
  @ApiOperation({ summary: 'Get comments from the thread' })
  @ApiParam({ name: 'threadId', description: 'ID thread' })
  @ApiQuery({
    name: 'sort',
    enum: ['popular', 'new', 'old'],
    required: false,
    description: 'popular | new |old (default new)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({
    description: 'Paginated comments from the thread',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(CommentDto) },
            },
          },
        },
      ],
    },
  })
  async getCommentsByThread(
    @Param('threadId') threadId: string,
    @Req() req: Request,
    @Query('sort') sort: 'popular' | 'new' | 'old' = 'new',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaginatedDto<CommentDto>> {
    const userId = this.userService.getUserIdFromRequest(req);
    // await this.threadService.clickThread(threadId, userId);
    return this.commentService.getCommentsByThread(
      threadId,
      userId,
      sort,
      page,
      limit,
    );
  }

  @Patch(':id/like')
  @ApiOperation({ summary: 'Like or dislike a comment (toggle)' })
  @ApiParam({ name: 'id', description: 'ID comment' })
  @ApiResponse({
    status: 200,
    description: 'New count likes and isLiked',
    type: LikeInfoDto,
  })
  async toggleLike(@Param('id') id: string, @Req() req: Request): Promise<LikeInfoDto> {
    const userId = this.userService.getUserIdFromRequest(req);
    return this.likeService.toggleLike('comment', id, userId);
  }
}
