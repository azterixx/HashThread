import { UserService } from './user.service';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ThreadService } from '../thread/thread.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Thread } from '../thread/thread.schema';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly threadService: ThreadService) {
  }

  @ApiOperation({ summary: 'Get all threads liked by the user' })
  @ApiResponse({
    status: 200,
    description: 'List of threads liked by the user',
    type: [Thread],
  })
  @Get('liked-threads')
  async getLikedThreads(@Req() req: Request) {
    const userId = this.userService.getUserIdFromRequest(req);
    return this.threadService.getLikedThreadsByUserId(userId);
  }
}


