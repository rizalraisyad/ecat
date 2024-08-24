import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDecimal,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class VarietyDto {
  @ApiProperty({ description: 'Name of the variety', example: '32GB' })
  @IsString()
  @IsNotEmpty()
  varietyName: string;

  @ApiProperty({
    description: 'Price of the variety',
    example: 250.0,
    type: 'number',
  })
  @IsDecimal()
  varietyPrice: number;

  @ApiProperty({ description: 'Stock available for the variety', example: 100 })
  @IsNumber()
  stock: number;
}

export class ImageDto {
  @ApiProperty({
    description: 'URL of the image',
    example: 'http://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Indicates if this is the primary image for the product',
    example: true,
  })
  @IsBoolean()
  isPrimary: boolean;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Smartphone' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Latest model with advanced features',
    required: false,
  })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty({
    description: 'Condition of the product',
    example: 'New',
    required: false,
  })
  @IsString()
  @IsOptional()
  productCondition?: string;

  @ApiProperty({
    description: 'Weight of the product in kilograms',
    example: 0.5,
    required: false,
    type: 'number',
  })
  @IsDecimal()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'List of varieties for the product',
    type: [VarietyDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VarietyDto)
  varieties?: VarietyDto[];

  @ApiProperty({
    description: 'List of images for the product',
    type: [ImageDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];

  @ApiProperty({
    description: 'Tags associated with the product',
    example: ['Electronics', 'Portable'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
