import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Thread, ThreadSchema } from './thread.schema';
import { UserService } from '../user/user.service';
import { LikeModule } from '../like/like.module';
import { MinioService } from '../minio/minio.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
    ]),
    LikeModule,

  ],
  controllers: [ThreadController],
  providers: [ThreadService, UserService, MinioService],
  exports: [ThreadService, MongooseModule],
})
export class ThreadModule {
}
