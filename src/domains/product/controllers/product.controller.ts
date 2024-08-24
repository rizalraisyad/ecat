import {
  Controller,
  Inject,
  Body,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PRODUCT_SERVICE } from '../product.constant';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductService } from '../services/product.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
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

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Product ID', type: Number })
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({ status: 204, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async deleteProduct(@Param('id') id: number): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
