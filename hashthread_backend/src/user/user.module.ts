import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ThreadModule } from '../thread/thread.module';

@Module({
  imports: [ThreadModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}
