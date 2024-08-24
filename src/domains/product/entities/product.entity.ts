import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariety } from './product-variety.entity';
import { ProductImage } from './product-image.entity';
import { ProductTagLink } from './product-tag-link.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product',
  })
  @PrimaryGeneratedColumn()
  productId: number;

  @ApiProperty({ example: 'Smartphone', description: 'Name of the product' })
  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @ApiProperty({
    example: 'Latest model with advanced features',
    description: 'Description of the product',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  productDescription: string;

  @ApiProperty({
    example: 0.5,
    description: 'Weight of the product in kilograms',
    required: false,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @ApiProperty({
    example: 'New',
    description: 'Condition of the product (New, Used, etc.)',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  productCondition: string;

  @ApiProperty({
    example: '2024-08-24T00:00:00.000Z',
    description: 'Timestamp when the product was created',
  })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-08-24T00:00:00.000Z',
    description: 'Timestamp when the product was last updated',
  })
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ProductVariety, (variety) => variety.product)
  varieties: ProductVariety[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductTagLink, (tagLink) => tagLink.product)
  tagLinks: ProductTagLink[];
}
