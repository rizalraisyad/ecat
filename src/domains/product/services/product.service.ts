import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository.';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductVariety } from '../entities/product-variety.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductTag } from '../entities/product-tag.entity';
import { ProductTagLink } from '../entities/product-tag-link.entity';
import {
  PRODUCT_REPO,
  PRODUCTIMAGE_REPO,
  PRODUCTTAG_REPO,
  PRODUCTTAGLINK_REPO,
  ProductVARIETY_REPO,
} from '../product.constant';
import { ProductVarietyRepository } from '../repositories/product-variety.repository';
import { ProductImageRepository } from '../repositories/product-image.repository';
import { ProductTagRepository } from '../repositories/product-tag.repository';
import { ProductTagLinkRepository } from '../repositories/product-tag-link.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPO)
    private productRepository: ProductRepository,
    @Inject(ProductVARIETY_REPO)
    private productVarietyRepository: ProductVarietyRepository,
    @Inject(PRODUCTIMAGE_REPO)
    private productImageRepository: ProductImageRepository,
    @Inject(PRODUCTTAG_REPO)
    private productTagRepository: ProductTagRepository,
    @Inject(PRODUCTTAGLINK_REPO)
    private productTagLinkRepository: ProductTagLinkRepository,
  ) {}
  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    const reqProduct = this.createProductEntity(createProductDto);
    const product = await this.productRepository.save(reqProduct);

    if (createProductDto.varieties) {
      await this.addProductVarieties(product, createProductDto.varieties);
    }

    if (createProductDto.images) {
      await this.addProductImages(product, createProductDto.images);
    }

    if (createProductDto.tags) {
      await this.addProductTags(product, createProductDto.tags);
    }

    return product;
  }

  private createProductEntity(createProductDto: CreateProductDto): Product {
    const { productName, productDescription, productCondition, weight } =
      createProductDto;
    const product = new Product();
    product.productName = productName;
    product.productDescription = productDescription;
    product.productCondition = productCondition;
    product.weight = weight;
    return product;
  }

  private async addProductVarieties(
    product: Product,
    varieties: { varietyName: string; varietyPrice: number; stock: number }[],
  ): Promise<void> {
    for (const variety of varieties) {
      const productVariety = new ProductVariety();
      productVariety.product = product;
      productVariety.varietyName = variety.varietyName;
      productVariety.varietyPrice = variety.varietyPrice;
      productVariety.stockQuantity = variety.stock;
      await this.productVarietyRepository.saveProductVar(productVariety);
    }
  }

  private async addProductImages(
    product: Product,
    images: { imageUrl: string; isPrimary: boolean }[],
  ): Promise<void> {
    for (const image of images) {
      const productImage = new ProductImage();
      productImage.product = product;
      productImage.imageUrl = image.imageUrl;
      productImage.isPrimary = image.isPrimary;
      await this.productImageRepository.saveProductImage(productImage);
    }
  }

  private async addProductTags(
    product: Product,
    tags: string[],
  ): Promise<void> {
    for (const tagName of tags) {
      let tag = await this.productTagRepository.findProductTag(tagName);
      if (!tag) {
        tag = new ProductTag();
        tag.tagName = tagName;
        await this.productTagRepository.saveProductTag(tag);
      }

      const tagLink = new ProductTagLink();
      tagLink.product = product;
      tagLink.tag = tag;
      await this.productTagLinkRepository.saveProductTagLink(tagLink);
    }
  }
}
