import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Thread, ThreadDocument } from '../thread/thread.schema';
import { FeedThreadDto } from './dto/feed-thread.dto';
import { PaginationProvider } from '../common/pagination.provider';
import { PaginatedDto } from '../common/dto/pagintation.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>,
    private readonly paginator: PaginationProvider,
  ) {
  }

  async getHotThreads(
    page = 1,
    limit = 10,
    userId: string,
  ): Promise<PaginatedDto<FeedThreadDto>> {
    const base: PipelineStage[] = [
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$likeCount', 2] },
              { $multiply: ['$clicks', 1] },
              { $multiply: ['$messageCount', 0.1] },
            ],
          },
          isLiked: { $in: [userId, '$likedBy'] },
          isOp: { $eq: ['$ownerId', userId] },
        },
      },
      { $sort: { score: -1 } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          text: 1,
          messageCount: 1,
          likeCount: 1,
          createdAt: 1,
          isLiked: 1,
          isOp: 1,
          files: 1,
        },
      },
    ];

    return this.paginator.aggregatePaginate<FeedThreadDto>(
      this.threadModel,
      base,
      page,
      limit,
    );
  }

  async getNormalThreads(
    sort: 'old' | 'new',
    page = 1,
    limit = 10,
    userId: string,
  ): Promise<PaginatedDto<FeedThreadDto>> {
    const base: PipelineStage[] = [
      { $sort: { createdAt: sort === 'old' ? 1 : -1 } },
      {
        $addFields: {
          isLiked: { $in: [userId, '$likedBy'] },
          isOp: { $eq: ['$ownerId', userId] },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          text: 1,
          messageCount: 1,
          likeCount: 1,
          createdAt: 1,
          isLiked: 1,
          isOp: 1,
          files: 1,
        },
      },
    ];

    return this.paginator.aggregatePaginate<FeedThreadDto>(
      this.threadModel,
      base,
      page,
      limit,
    );
  }
}
