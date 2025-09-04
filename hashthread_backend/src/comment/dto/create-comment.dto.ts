import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID of the thread where the comment is created' })
  threadId: string;

  @ApiProperty({ description: 'Comment text' })
  text: string;

  @ApiPropertyOptional({
    description: 'Message number being replied to (replyTo)',
    type: 'number',
    nullable: true,
  })
  replyTo?: number;
}

export class CreateCommentWithFilesDto extends CreateCommentDto {
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