import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ default: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ default: 10, description: 'Number of items per page' })
  @IsInt()
  @Min(1)
  limit: number = 10;
}
