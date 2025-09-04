import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from '../thread/thread.schema';
import { Comment, CommentDocument } from '../comment/comment.schema';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
  }

  async toggleLike(
    type: 'thread' | 'comment',
    itemId: string,
    userId: string,
  ): Promise<{ likeCount: number; isLiked: boolean }> {
    if (type === 'thread') {
      const like = await this.threadModel.findOneAndUpdate(
        { _id: itemId, likedBy: { $ne: userId } },
        { $addToSet: { likedBy: userId }, $inc: { likeCount: 1 } },
        { new: true },
      );
      if (like) return { likeCount: like.likeCount, isLiked: true };

      const dislike = await this.threadModel.findOneAndUpdate(
        { _id: itemId, likedBy: userId },
        { $pull: { likedBy: userId }, $inc: { likeCount: -1 } },
        { new: true },
      );
      if (!dislike) throw new BadRequestException('thread not found');
      return { likeCount: dislike.likeCount, isLiked: false };
    }

    const like = await this.commentModel.findOneAndUpdate(
      { _id: itemId, likedBy: { $ne: userId } },
      { $addToSet: { likedBy: userId }, $inc: { likeCount: 1 } },
      { new: true },
    );
    if (like) return { likeCount: like.likeCount, isLiked: true };

    const dislike = await this.commentModel.findOneAndUpdate(
      { _id: itemId, likedBy: userId },
      { $pull: { likedBy: userId }, $inc: { likeCount: -1 } },
      { new: true },
    );
    if (!dislike) throw new BadRequestException('comment not found');
    return { likeCount: dislike.likeCount, isLiked: false };
  }


}
