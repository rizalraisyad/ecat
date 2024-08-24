import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductImage } from '../entities/product-image.entity';

@Injectable()
export class ProductImageRepository extends Repository<ProductImage> {
  constructor(manager: EntityManager) {
    super(ProductImage, manager);
  }

  saveProductImage(productImage: ProductImage): Promise<ProductImage> {
    return this.save(productImage);
  }
}
