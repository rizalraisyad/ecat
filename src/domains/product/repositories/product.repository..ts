import { EntityManager, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(manager: EntityManager) {
    super(Product, manager);
  }

  saveProduct(product: Product): Promise<Product> {
    return this.save(product);
  }

  findProductById(id: number): Promise<Product> {
    return this.findOne({
      where: { productId: id },
      relations: ['varieties', 'images', 'tagLinks'],
    });
  }
}
