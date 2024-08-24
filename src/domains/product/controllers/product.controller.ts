import {
  Controller,
  Inject,
  Body,
  Post,
  Put,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
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
import { PaginationDto } from '../dto/pagination.dto';

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

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of products' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
  })
  async getProducts(
    @Query() paginationDto: PaginationDto,
    @Query('search') searchQuery?: string,
  ): Promise<{ products: Product[]; total: number }> {
    paginationDto.limit = paginationDto.limit ? paginationDto.limit : 100;
    paginationDto.page = paginationDto.page ? paginationDto.page : 1;
    const [products, total] = await this.productService.getProducts(
      paginationDto,
      searchQuery,
    );
    return { products, total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID with all relations' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productService.getProductById(id);
  }
}
