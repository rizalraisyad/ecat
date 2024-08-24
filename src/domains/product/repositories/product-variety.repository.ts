import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductVariety } from '../entities/product-variety.entity';

@Injectable()
export class ProductVarietyRepository extends Repository<ProductVariety> {
  constructor(manager: EntityManager) {
    super(ProductVariety, manager);
  }

  saveProductVar(productVar: ProductVariety): Promise<ProductVariety> {
    return this.save(productVar);
  }
}
