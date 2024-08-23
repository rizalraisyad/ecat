import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductStock } from './product-stock.entity';

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

  @OneToMany(() => ProductStock, (stock) => stock.variety)
  stocks: ProductStock[];
}
