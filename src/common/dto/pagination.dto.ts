import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { OrderBy, order } from '../interfaces/pagination.interface';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    default: 1,
    description: 'Specify the page number',
  })
  readonly page?: number;

  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    default: 20,
    description: 'Specify the per page size',
  })
  readonly perPage?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    example: OrderBy.DESC,
    enum: OrderBy,
    description: 'Specify the ordering criteria',
  })
  @Transform(({ value, obj }) => {
    return { [obj.orderAt || 'id']: value };
  })
  public orderBy?: order;
}
