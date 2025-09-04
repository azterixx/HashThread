import { ApiProperty } from '@nestjs/swagger';

export class FeedThreadDto {
  @ApiProperty({ description: 'Thread ID' })
  id: string;

  @ApiProperty({ description: 'Thread text' })
  text: string;

  @ApiProperty({ description: 'Number of messages' })
  messageCount: number;

  @ApiProperty({ description: 'Number of likes' })
  likeCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Flag indicating whether the current user has liked the thread' })
  isLiked: boolean;

  @ApiProperty({ description: 'Flag indicating whether the current user is the author (OP)' })
  isOp: boolean;

  @ApiProperty({
    description: 'List of uploaded files',
    type: [String],
  })
  files: string[];
}
