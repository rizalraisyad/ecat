import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductTag } from '../entities/product-tag.entity';

@Injectable()
export class ProductTagRepository extends Repository<ProductTag> {
  constructor(manager: EntityManager) {
    super(ProductTag, manager);
  }

  saveProductTag(productTag: ProductTag): Promise<ProductTag> {
    return this.save(productTag);
  }

  findProductTag(tagName: string): Promise<ProductTag> {
    return this.findOne({ where: { tagName } });
  }
}
