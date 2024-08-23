import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductTagLink } from './product-tag-link.entity';

@Entity('product_tags')
export class ProductTag {
  @PrimaryGeneratedColumn()
  tagId: number;

  @Column({ type: 'varchar', length: 255 })
  tagName: string;

  @OneToMany(() => ProductTagLink, (tagLink) => tagLink.tag)
  tagLinks: ProductTagLink[];
}
