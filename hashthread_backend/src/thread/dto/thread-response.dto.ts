import { ApiProperty } from '@nestjs/swagger';

export class ThreadResponseDto {
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
  @ApiProperty({ description: 'Whether the user has liked the thread' })
  isLiked: boolean;

  @ApiProperty({ description: 'Whether the current user is the author of the thread', required: false })
  isOp?: boolean;

  @ApiProperty({
    description: 'List of uploaded files',
    required: false,
    type: [String],
  })
  files?: string[];


}
