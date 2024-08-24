import { CreateProductDto } from '../../dto/create-product.dto';
import {
  PRODUCT_REPO,
  PRODUCTIMAGE_REPO,
  PRODUCTTAG_REPO,
  PRODUCTTAGLINK_REPO,
  ProductVARIETY_REPO,
} from '../../product.constant';
import { ProductImageRepository } from '../../repositories/product-image.repository';
import { ProductTagLinkRepository } from '../../repositories/product-tag-link.repository';
import { ProductTagRepository } from '../../repositories/product-tag.repository';
import { ProductVarietyRepository } from '../../repositories/product-variety.repository';
import { ProductRepository } from '../../repositories/product.repository.';
import { ProductService } from './../product.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProductService', () => {
  let service: ProductService;
  let mockProductRepository: Partial<ProductRepository>;
  let mockProductVarietyRepository: Partial<ProductVarietyRepository>;
  let mockProductImageRepository: Partial<ProductImageRepository>;
  let mockProductTagRepository: Partial<ProductTagRepository>;
  let mockProductTagLinkRepository: Partial<ProductTagLinkRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      save: jest
        .fn()
        .mockImplementation((prod) =>
          Promise.resolve({ ...prod, product_id: Date.now() }),
        ),
    };
    mockProductVarietyRepository = {
      saveProductVar: jest.fn(),
    };
    mockProductImageRepository = {
      saveProductImage: jest.fn(),
    };
    mockProductTagRepository = {
      findProductTag: jest.fn().mockImplementation(() => null),
      saveProductTag: jest.fn(),
    };
    mockProductTagLinkRepository = {
      saveProductTagLink: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PRODUCT_REPO, useValue: mockProductRepository },
        {
          provide: ProductVARIETY_REPO,
          useValue: mockProductVarietyRepository,
        },
        { provide: PRODUCTIMAGE_REPO, useValue: mockProductImageRepository },
        { provide: PRODUCTTAG_REPO, useValue: mockProductTagRepository },
        {
          provide: PRODUCTTAGLINK_REPO,
          useValue: mockProductTagLinkRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should create a product and its dependencies correctly', async () => {
    const dto: CreateProductDto = {
      productName: 'Test Product',
      productDescription: 'Test Description',
      productCondition: 'New',
      weight: 1.5,
      varieties: [{ varietyName: 'Variety 1', varietyPrice: 100, stock: 10 }],
      images: [{ imageUrl: 'http://example.com/test.jpg', isPrimary: true }],
      tags: ['Tag1', 'Tag2'],
    };

    const result = await service.addProduct(dto);
    expect(result).toBeDefined();
    expect(mockProductRepository.save).toHaveBeenCalled();
    expect(mockProductVarietyRepository.saveProductVar).toHaveBeenCalled();
    expect(mockProductImageRepository.saveProductImage).toHaveBeenCalled();
    expect(mockProductTagRepository.saveProductTag).toHaveBeenCalledTimes(2);
    expect(
      mockProductTagLinkRepository.saveProductTagLink,
    ).toHaveBeenCalledTimes(2);
  });
});
