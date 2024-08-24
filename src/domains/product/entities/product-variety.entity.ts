import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_varieties')
export class ProductVariety {
  @PrimaryGeneratedColumn()
  varietyId: number;

  @ManyToOne(() => Product, (product) => product.varieties)
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  varietyName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  varietyPrice: number;

  @Column({ type: 'int' })
  stockQuantity: number;
}
