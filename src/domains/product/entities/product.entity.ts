import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductVariety } from './product-variety.entity';
import { ProductImage } from './product-image.entity';
import { ProductTagLink } from './product-tag-link.entity';
import { ProductStock } from './product-stock.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'text', nullable: true })
  productDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

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

  @OneToMany(() => ProductStock, (stock) => stock.product)
  stocks: ProductStock[];
}
