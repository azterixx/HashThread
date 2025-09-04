import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { Thread, ThreadSchema } from 'src/thread/thread.schema';
import { UserService } from '../user/user.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
    CommonModule,
  ],
  providers: [FeedService, UserService],
  controllers: [FeedController],
})
export class FeedModule {
}
