import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domains/product/entities/product.entity';
import { StockLog } from './domains/product/entities/stock-log.entity';
import { ProductVariety } from './domains/product/entities/product-variety.entity';
import { ProductTag } from './domains/product/entities/product-tag.entity';
import { ProductTagLink } from './domains/product/entities/product-tag-link.entity';
import { ProductStock } from './domains/product/entities/product-stock.entity';
import { ProductImage } from './domains/product/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [
        Product,
        StockLog,
        ProductVariety,
        ProductTag,
        ProductTagLink,
        ProductStock,
        ProductImage,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
