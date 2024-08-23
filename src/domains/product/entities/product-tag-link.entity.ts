import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductTag } from './product-tag.entity';

@Entity('product_tag_links')
export class ProductTagLink {
  @PrimaryGeneratedColumn()
  linkId: number;

  @ManyToOne(() => Product, (product) => product.tagLinks)
  product: Product;

  @ManyToOne(() => ProductTag, (tag) => tag.tagLinks)
  tag: ProductTag;
}
