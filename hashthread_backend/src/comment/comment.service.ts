import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { Thread, ThreadDocument } from '../thread/thread.schema';
import { CommentDto } from './dto/comment.dto';
import { PaginationProvider } from '../common/pagination.provider';
import { PaginatedDto } from '../common/dto/pagintation.dto';


@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Thread.name)
    private readonly threadModel: Model<ThreadDocument>,
    private readonly paginator: PaginationProvider,
  ) {
  }

  async createComment(
    threadId: string,
    text: string,
    replyTo?: number,
    isOp?: boolean,
  ): Promise<CommentDto> {
    const thread = await this.getThreadOrThrow(threadId);
    const expireDate = this.calculateExpireDate(thread.createdAt);

    text = text.trim().replace(/\s+/g, ' ');
    if (text.length === 0) {
      throw new BadRequestException('Comment text is required');
    }
    if (text.length > 500) {
      throw new BadRequestException('Text must be less than 500 characters');
    }

    const messageNumber = await this.incrementMessageCount(threadId);

    const comment = new this.commentModel({
      threadId: thread._id,
      text,
      messageNumber,
      replyTo: typeof replyTo === 'number' && replyTo !== 0 ? replyTo : null,
      threadExpiresAt: expireDate,
      isOp,
    });

    const savedComment = await comment.save();

    if (replyTo) {
      await this.commentModel.updateOne(
        { threadId: thread._id, messageNumber: replyTo },
        { $inc: { replyCount: 1 } },
      );
    }

    return this.toCommentDto(savedComment);
  }

  async findByMessageNumber(
    threadId: string,
    messageNumber: number,
  ): Promise<CommentDocument | null> {
    return this.commentModel
      .findOne({
        threadId: new Types.ObjectId(threadId),
        messageNumber,
      })
      .exec();
  }

  async addFilesToComment(commentId: string, files: string[]): Promise<void> {
    await this.commentModel.findByIdAndUpdate(
      commentId,
      { $push: { files: { $each: files } } },
      { new: true },
    );
  }


  async getCommentsByThread(
    threadId: string,
    userId: string | undefined,
    sort: 'popular' | 'new' | 'old' = 'new',
    page = 1,
    limit = 20,
  ): Promise<PaginatedDto<CommentDto>> {
    const objectId = new Types.ObjectId(threadId);

    const base: PipelineStage[] = [
      { $match: { threadId: objectId } },
      {
        $addFields: {
          popularityScore: {
            $add: [{ $multiply: ['$likeCount', 2] }, '$replyCount'],
          },
          isLiked: { $in: [userId ?? '', '$likedBy'] },
        },
      },
      {
        $sort:
          sort === 'popular'
            ? { popularityScore: -1, createdAt: -1 }
            : sort === 'old'
              ? { createdAt: 1 }
              : { createdAt: -1 },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          text: 1,
          messageNumber: 1,
          createdAt: 1,
          threadId: 1,
          replyTo: 1,
          isOp: 1,
          likeCount: 1,
          replyCount: 1,
          isLiked: 1,
          files: 1,
        },
      },
    ];

    return this.paginator.aggregatePaginate<CommentDto>(
      this.commentModel,
      base,
      page,
      limit,
    );
  }

  private async getThreadOrThrow(threadId: string): Promise<ThreadDocument> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  private async incrementMessageCount(threadId: string): Promise<number> {
    const updated = await this.threadModel.findOneAndUpdate(
      { _id: threadId },
      { $inc: { messageCount: 1 } },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Thread not found after update');
    return updated.messageCount;
  }

  private calculateExpireDate(createdAt: Date): Date {
    return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  }

  private toCommentDto(doc: CommentDocument): CommentDto {
    return {
      id: doc._id.toString(),
      text: doc.text,
      messageNumber: doc.messageNumber,
      createdAt: doc.createdAt,
      threadId: doc.threadId.toString(),
      replyTo: doc.replyTo,
      isOp: doc.isOp,
      likeCount: doc.likeCount,
      replyCount: doc.replyCount,
    };
  }
}
