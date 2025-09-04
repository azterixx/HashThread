import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Request } from 'express';
import { FeedService } from './feed.service';
import { UserService } from '../user/user.service';
import { FeedThreadDto } from './dto/feed-thread.dto';
import { PaginatedDto } from '../common/dto/pagintation.dto';

@ApiTags('feed')
@Controller('feed')
@ApiExtraModels(PaginatedDto, FeedThreadDto)
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly userService: UserService,
  ) {
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of threads' })
  @ApiQuery({
    name: 'sort',
    enum: ['hot', 'old', 'new'],
    required: false,
    description:
      "'hot' – trending, 'old' – oldest first, 'new' – newest first (default)",
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({
    description: 'Paginated list of threads',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(FeedThreadDto) },
            },
          },
        },
      ],
    },
  })
  async getFeed(
    @Req() req: Request,
    @Query('sort') sort: 'hot' | 'old' | 'new' = 'new',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedDto<FeedThreadDto>> {
    const userId = this.userService.getUserIdFromRequest(req);

    return sort === 'hot'
      ? this.feedService.getHotThreads(page, limit, userId)
      : this.feedService.getNormalThreads(sort, page, limit, userId);
  }
}
