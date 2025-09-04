import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { Comment, CommentSchema } from '../comment/comment.schema';
import { Thread, ThreadSchema } from '../thread/thread.schema';
import { LikeController } from './like.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],

})
export class LikeModule {
}
