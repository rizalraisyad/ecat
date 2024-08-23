import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariety } from './product-variety.entity';
import { StockLog } from './stock-log.entity';

@Entity('product_stocks')
export class ProductStock {
  @PrimaryGeneratedColumn()
  stockId: number;

  @ManyToOne(() => Product, (product) => product.stocks)
  product: Product;

  @ManyToOne(() => ProductVariety, (variety) => variety.stocks)
  variety: ProductVariety;

  @Column({ type: 'int' })
  stockQuantity: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  lastUpdated: Date;

  @OneToMany(() => StockLog, (log) => log.stock)
  logs: StockLog[];
}
