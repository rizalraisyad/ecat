import { Controller, Inject, Body, Post } from '@nestjs/common';
import { PRODUCT_SERVICE } from '../product.constant';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductService } from '../services/product.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productService: ProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.addProduct(createProductDto);
  }
}
