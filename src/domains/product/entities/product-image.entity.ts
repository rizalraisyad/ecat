import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  imageId: number;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;
}
