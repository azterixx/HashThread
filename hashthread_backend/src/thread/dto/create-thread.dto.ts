import { ApiProperty } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({
    description: 'Text of the new thread',
    example: 'Hello World!',
  })
  text: string;
}

export class CreateThreadWithFilesDto extends CreateThreadDto {
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