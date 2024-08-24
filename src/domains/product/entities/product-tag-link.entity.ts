import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductTag } from './product-tag.entity';

@Entity('product_tag_links')
export class ProductTagLink {
  @PrimaryGeneratedColumn()
  linkId: number;

  @ManyToOne(() => Product, (product) => product.tagLinks)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => ProductTag, (tag) => tag.tagLinks)
  @JoinColumn({ name: 'tagId' })
  tag: ProductTag;
}
