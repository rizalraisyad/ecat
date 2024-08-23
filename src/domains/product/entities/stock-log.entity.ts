import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductStock } from './product-stock.entity';

@Entity('stock_logs')
export class StockLog {
  @PrimaryGeneratedColumn()
  logId: number;

  @ManyToOne(() => ProductStock, (stock) => stock.logs)
  stock: ProductStock;

  @Column({ type: 'int' })
  changeQuantity: number;

  @Column({ type: 'varchar', length: 255 })
  changeReason: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  changedAt: Date;
}
