import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from './thread.schema';
import { ThreadResponseDto } from './dto/thread-response.dto';

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {
  }

  async getLikedThreadsByUserId(userId: string): Promise<any[]> {
    const threads = await this.threadModel
      .find({ likedBy: userId })
      .select('-likedBy -clickedBy -clicks -ownerId')
      .lean()
      .exec();

    return threads.map(t => ({ ...t, isLiked: true }));
  }


  private async findThreadById(threadId: string): Promise<ThreadDocument> {
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new NotFoundException('Thread not found');
    }
    return thread;
  }


  async createThread(text: string, ownerId: string): Promise<ThreadResponseDto> {
    if (!text) {
      throw new BadRequestException('Thread text is required');
    }

    text = text.trim().replace(/\s+/g, ' ');

    if (text.length === 0) {
      throw new BadRequestException('Thread text is required');
    }

    if (text.length > 500) {
      throw new BadRequestException('Text must be less than 500 characters');
    }

    const createdThread = new this.threadModel({
      text,
      ownerId,
    });
    const savedThread = await createdThread.save();

    return {
      isLiked: false,
      id: savedThread.id.toString(),
      text: savedThread.text,
      messageCount: savedThread.messageCount,
      likeCount: savedThread.likeCount,
      createdAt: savedThread.createdAt,
      isOp: savedThread.ownerId === ownerId,
    };
  }

  async addFilesToThread(threadId: string, files: string[]) {
    await this.threadModel.findByIdAndUpdate(
      threadId,
      { $push: { files: { $each: files } } },
      { new: true },
    );
  }


  async checkIsOp(threadId: string, userId: string): Promise<boolean> {
    const thread = await this.threadModel
      .findById(threadId)
      .select('ownerId')
      .lean();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread.ownerId.toString() === userId.toString();
  }


  async clickThread(threadId: string, userId: string): Promise<void> {
    await this.threadModel.updateOne(
      { _id: threadId, clickedBy: { $ne: userId } },
      {
        $addToSet: { clickedBy: userId },
        $inc: { clicks: 1 },
      },
    );
  }


  async getThreadById(threadId: string, userId: string): Promise<ThreadResponseDto> {
    const thread = await this.findThreadById(threadId);
    const isOp = thread.ownerId === userId;
    const isLiked = thread.likedBy?.includes(userId) ?? false;

    return {
      id: thread.id.toString(),
      text: thread.text,
      messageCount: thread.messageCount,
      likeCount: thread.likeCount,
      createdAt: thread.createdAt,
      isOp,
      files: thread.files,
      isLiked: isLiked,
    };
  }
}


