import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository.';
import {
  CreateProductDto,
  ImageDto,
  VarietyDto,
} from '../dto/create-product.dto';
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

  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    const reqProduct = this.createProductEntity(createProductDto);
    const product = await this.productRepository.saveProduct(reqProduct);

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

  private async updateProductVarieties(
    product: Product,
    varietiesDto: VarietyDto[],
  ): Promise<void> {
    const existingVarieties = await this.productVarietyRepository.find({
      where: { product: { productId: product.productId } },
    });

    const varietyDtoMap = new Map(
      varietiesDto.map((dto) => [dto.varietyName, dto]),
    );

    for (const variety of existingVarieties) {
      const dto = varietyDtoMap.get(variety.varietyName);
      if (dto) {
        variety.varietyPrice = dto.varietyPrice;
        variety.stockQuantity = dto.stock;
        await this.productVarietyRepository.saveProductVar(variety);
        varietyDtoMap.delete(variety.varietyName);
      } else {
        await this.productVarietyRepository.remove(variety);
      }
    }

    for (const dto of varietyDtoMap.values()) {
      const newVariety = new ProductVariety();
      newVariety.product = product;
      newVariety.varietyName = dto.varietyName;
      newVariety.varietyPrice = dto.varietyPrice;
      newVariety.stockQuantity = dto.stock;
      await this.productVarietyRepository.saveProductVar(newVariety);
    }
  }

  private async updateProductImages(
    product: Product,
    imagesDto: ImageDto[],
  ): Promise<void> {
    const existingImages = await this.productImageRepository.find({
      where: { product: { productId: product.productId } },
    });
    const imageDtoMap = new Map(imagesDto.map((dto) => [dto.imageUrl, dto]));

    for (const image of existingImages) {
      const dto = imageDtoMap.get(image.imageUrl);
      if (dto) {
        image.isPrimary = dto.isPrimary;
        await this.productImageRepository.saveProductImage(image);
        imageDtoMap.delete(image.imageUrl);
      } else {
        await this.productImageRepository.remove(image);
      }
    }

    for (const dto of imageDtoMap.values()) {
      const newImage = new ProductImage();
      newImage.product = product;
      newImage.imageUrl = dto.imageUrl;
      newImage.isPrimary = dto.isPrimary;
      await this.productImageRepository.saveProductImage(newImage);
    }
  }

  private async updateProductTags(
    product: Product,
    tags: string[],
  ): Promise<void> {
    const existingTags = await this.productTagLinkRepository.find({
      where: { product: { productId: product.productId } },
      relations: ['tag'],
    });

    const existingTagNames = new Set(
      existingTags.map((tagLink) => tagLink.tag.tagName),
    );

    for (const tagLink of existingTags) {
      if (!tags.includes(tagLink.tag.tagName)) {
        await this.productTagLinkRepository.remove(tagLink);
      }
    }

    for (const tagName of tags) {
      if (!existingTagNames.has(tagName)) {
        let tag = await this.productTagRepository.findOne({
          where: { tagName },
        });
        if (!tag) {
          tag = this.productTagRepository.create({ tagName });
          await this.productTagRepository.save(tag);
        }
        const tagLink = this.productTagLinkRepository.create({ product, tag });
        await this.productTagLinkRepository.save(tagLink);
      }
    }
  }

  async updateProduct(
    id: number,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    product.productName = createProductDto.productName;
    product.productDescription =
      createProductDto.productDescription ?? product.productDescription;

    product.productCondition =
      createProductDto.productCondition ?? product.productCondition;

    product.weight = createProductDto.weight ?? product.weight;
    await this.productRepository.save(product);

    if (createProductDto.varieties) {
      await this.updateProductVarieties(product, createProductDto.varieties);
    }

    if (createProductDto.images) {
      await this.updateProductImages(product, createProductDto.images);
    }

    if (createProductDto.tags) {
      await this.updateProductTags(product, createProductDto.tags);
    }

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    await this.productVarietyRepository.delete({ product: { productId: id } });
    await this.productImageRepository.delete({ product: { productId: id } });
    await this.productTagLinkRepository.delete({ product: { productId: id } });

    await this.productRepository.delete({ productId: id });
  }
}
