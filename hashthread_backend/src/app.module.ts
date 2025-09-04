import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreadModule } from './thread/thread.module';

import * as cookieParser from 'cookie-parser';
import { UserIdMiddleware } from 'middleware/user-id.middleware';
import { FeedModule } from './feed/feed.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { LikeModule } from './like/like.module';
import { MinioModule } from './minio/minio.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!, {}),
    ThreadModule,
    FeedModule,
    CommentModule,
    UserModule,
    LikeModule,
    MinioModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
     
      .apply(cookieParser(), UserIdMiddleware)
      .forRoutes('*');
  }
}
