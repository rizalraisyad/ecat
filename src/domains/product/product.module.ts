import { ProductVarietyRepository } from './repositories/product-variety.repository';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import {
  PRODUCT_REPO,
  PRODUCT_SERVICE,
  PRODUCTIMAGE_REPO,
  PRODUCTTAG_REPO,
  PRODUCTTAGLINK_REPO,
  ProductVARIETY_REPO,
} from './product.constant';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository.';
import { Product } from './entities/product.entity';
import { ProductVariety } from './entities/product-variety.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductTag } from './entities/product-tag.entity';
import { ProductTagLink } from './entities/product-tag-link.entity';
import { ProductImageRepository } from './repositories/product-image.repository';
import { ProductTagRepository } from './repositories/product-tag.repository';
import { ProductTagLinkRepository } from './repositories/product-tag-link.repository';

const providers: Provider[] = [
  {
    provide: PRODUCT_SERVICE,
    useClass: ProductService,
  },
  {
    provide: PRODUCT_REPO,
    useClass: ProductRepository,
  },
  {
    provide: ProductVARIETY_REPO,
    useClass: ProductVarietyRepository,
  },
  {
    provide: PRODUCTIMAGE_REPO,
    useClass: ProductImageRepository,
  },
  {
    provide: PRODUCTTAG_REPO,
    useClass: ProductTagRepository,
  },
  {
    provide: PRODUCTTAGLINK_REPO,
    useClass: ProductTagLinkRepository,
  },
];
const controllers: any[] = [ProductController];

const repositories: any[] = [
  Product,
  ProductVariety,
  ProductImage,
  ProductTag,
  ProductTagLink,
  ProductRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([...repositories])],
  providers: [...providers],
  controllers: [...controllers],
})
export class ProductModule {}
