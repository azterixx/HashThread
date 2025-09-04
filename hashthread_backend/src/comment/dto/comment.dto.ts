import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ description: 'Comment text' })
  text: string;

  @ApiProperty({ description: 'Number of replies' })
  replyCount: number;

  @ApiProperty({ description: 'Message number within the thread' })
  messageNumber: number;

  @ApiProperty({ description: 'Comment creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'ID of the thread to which the comment belongs (as string)' })
  threadId: string;

  @ApiProperty({
    description: 'If the comment is a reply to another, this is the message number',
    nullable: true,
  })
  replyTo: number | null;

  @ApiProperty({ description: 'Number of likes' })
  likeCount: number;

  @ApiProperty({ description: 'Flag indicating whether the comment author is the thread owner' })
  isOp: boolean;

  @ApiProperty({ description: 'Comment ID' })
  id: string;

  @ApiProperty({ description: 'Whether the user liked' })
  isLiked?: boolean;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
    description: 'Array of files (images/videos)',
  })
  files?: any[];
}