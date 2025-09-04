import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './comment.schema';
import { Thread, ThreadSchema } from '../thread/thread.schema';
import { ThreadService } from '../thread/thread.service';
import { UserService } from '../user/user.service';
import { LikeModule } from '../like/like.module';
import { MinioService } from '../minio/minio.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Thread.name, schema: ThreadSchema },
    ]),
    LikeModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, ThreadService, UserService, MinioService],
  exports: [MongooseModule],
})
export class CommentModule {
}
