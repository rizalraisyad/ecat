import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductTagLink } from '../entities/product-tag-link.entity';

@Injectable()
export class ProductTagLinkRepository extends Repository<ProductTagLink> {
  constructor(manager: EntityManager) {
    super(ProductTagLink, manager);
  }

  saveProductTagLink(productTagLink: ProductTagLink): Promise<ProductTagLink> {
    return this.save(productTagLink);
  }
}
