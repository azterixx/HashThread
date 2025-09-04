import { ApiProperty } from '@nestjs/swagger';

export class LikeInfoDto {
  @ApiProperty({ description: 'Number of likes after the action' })
  likeCount: number;

  @ApiProperty({ description: 'Flag indicating whether the current user liked the thread' })
  isLiked: boolean;
}
