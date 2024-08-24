import { NotFoundException } from '@nestjs/common';
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
import { Product } from '../../entities/product.entity';
import { ProductTag } from '../../entities/product-tag.entity';
import { ProductTagLink } from '../../entities/product-tag-link.entity';
import { PaginationDto } from '../../dto/pagination.dto';
import { Like } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let mockProductRepository: Partial<ProductRepository>;
  let mockProductVarietyRepository: Partial<ProductVarietyRepository>;
  let mockProductImageRepository: Partial<ProductImageRepository>;
  let mockProductTagRepository: Partial<ProductTagRepository>;
  let mockProductTagLinkRepository: Partial<ProductTagLinkRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      saveProduct: jest.fn().mockImplementation((prod) => {
        return { ...prod, productId: Date.now() };
      }),
      findProductById: jest.fn().mockImplementation((id) => {
        if (id === 1) {
          return Promise.resolve(new Product());
        }
        return Promise.resolve(null);
      }),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
    };

    mockProductVarietyRepository = {
      saveProductVar: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    mockProductImageRepository = {
      saveProductImage: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      remove: jest.fn(),
      delete: jest.fn(),
    };

    mockProductTagRepository = {
      findProductTag: jest.fn().mockImplementation(() => null),
      saveProductTag: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(() => {
        Promise.resolve(new ProductTag());
      }),
    };

    mockProductTagLinkRepository = {
      saveProductTagLink: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      remove: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(() => {
        Promise.resolve(new ProductTagLink());
      }),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductById', () => {
    it('should return a product with all relations', async () => {
      const productId = 1;
      const mockProduct = new Product();
      mockProduct.productId = productId;
      mockProduct.productName = 'Test Product';
      mockProduct.images = [
        {
          imageUrl: 'http://example.com/image.jpg',
          isPrimary: true,
          imageId: 0,
          product: new Product(),
        },
      ];

      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(
        mockProduct,
      );

      const result = await service.getProductById(productId);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { productId },
        relations: ['varieties', 'images', 'tagLinks', 'tagLinks.tag'],
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw a NotFoundException if the product is not found', async () => {
      const productId = 999;

      (mockProductRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getProductById(productId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProducts', () => {
    it('should return paginated products with the primary image only', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockProducts = [
        {
          productId: 1,
          productName: 'Test Product 1',
          images: [
            { imageUrl: 'http://example.com/image1.jpg', isPrimary: true },
            { imageUrl: 'http://example.com/image2.jpg', isPrimary: false },
          ],
          varieties: [],
          tagLinks: [],
        },
        {
          productId: 2,
          productName: 'Test Product 2',
          images: [
            { imageUrl: 'http://example.com/image3.jpg', isPrimary: true },
          ],
          varieties: [],
          tagLinks: [],
        },
      ];

      (mockProductRepository.findAndCount as jest.Mock).mockResolvedValue([
        mockProducts,
        mockProducts.length,
      ]);

      const result = await service.getProducts(paginationDto);

      expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['varieties', 'images', 'tagLinks', 'tagLinks.tag'],
        skip: 0,
        take: 10,
        where: [],
      });

      // Check if only primary images are included
      expect(result[0][0].images.length).toBe(1);
      expect(result[0][0].images[0].imageUrl).toBe(
        'http://example.com/image1.jpg',
      );
      expect(result[0][1].images.length).toBe(1);
      expect(result[0][1].images[0].imageUrl).toBe(
        'http://example.com/image3.jpg',
      );
    });

    it('should return paginated products filtered by search query', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const searchQuery = 'Test';
      const mockProducts = [
        {
          productId: 1,
          productName: 'Test Product 1',
          images: [
            { imageUrl: 'http://example.com/image1.jpg', isPrimary: true },
          ],
          varieties: [],
          tagLinks: [{ tag: { tagName: 'TestTag' } }],
        },
      ];

      (mockProductRepository.findAndCount as jest.Mock).mockResolvedValue([
        mockProducts,
        mockProducts.length,
      ]);

      const result = await service.getProducts(paginationDto, searchQuery);

      expect(mockProductRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['varieties', 'images', 'tagLinks', 'tagLinks.tag'],
        skip: 0,
        take: 10,
        where: [
          { productName: Like(`%${searchQuery}%`) },
          { tagLinks: { tag: { tagName: Like(`%${searchQuery}%`) } } },
        ],
      });

      expect(result[0]).toEqual(mockProducts);
      expect(result[1]).toBe(mockProducts.length);
    });
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
    expect(mockProductRepository.saveProduct).toHaveBeenCalled();
    expect(mockProductVarietyRepository.saveProductVar).toHaveBeenCalled();
    expect(mockProductImageRepository.saveProductImage).toHaveBeenCalled();
    expect(mockProductTagRepository.saveProductTag).toHaveBeenCalledTimes(2);
    expect(
      mockProductTagLinkRepository.saveProductTagLink,
    ).toHaveBeenCalledTimes(2);
  });

  it('should throw a NotFoundException when updating a non-existent product', async () => {
    await expect(
      service.updateProduct(2, {} as CreateProductDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove old varieties, images, and tags when updating', async () => {
    const mockExistingVarieties = [
      { varietyName: 'Old Variety', varietyPrice: 80, stock: 3 },
    ];
    const mockExistingImages = [
      { imageUrl: 'http://example.com/old.jpg', isPrimary: true },
    ];
    const mockExistingTags = [{ tag: { tagName: 'OldTag' }, id: 1 }];

    (mockProductVarietyRepository.find as jest.Mock).mockResolvedValue(
      mockExistingVarieties,
    );
    (mockProductImageRepository.find as jest.Mock).mockResolvedValue(
      mockExistingImages,
    );
    (mockProductTagLinkRepository.find as jest.Mock).mockResolvedValue(
      mockExistingTags,
    );

    const dto: CreateProductDto = {
      productName: 'Updated Product',
      productDescription: 'Updated Description',
      varieties: [{ varietyName: 'Variety 2', varietyPrice: 120, stock: 5 }],
      images: [
        { imageUrl: 'http://example.com/test-updated.jpg', isPrimary: false },
      ],
      tags: ['Tag3', 'Tag4'],
    };

    await service.updateProduct(1, dto);

    expect(mockProductVarietyRepository.remove).toHaveBeenCalled();
    expect(mockProductImageRepository.remove).toHaveBeenCalled();
    expect(mockProductTagLinkRepository.remove).toHaveBeenCalled();
  });

  it('should handle adding varieties, images, and tags when they are not provided in the DTO', async () => {
    const dto: CreateProductDto = {
      productName: 'Test Product',
      productDescription: 'Test Description',
      productCondition: 'New',
      weight: 1.5,
      varieties: [],
      images: [],
      tags: [],
    };

    const result = await service.addProduct(dto);

    expect(result).toBeDefined();
    expect(mockProductRepository.saveProduct).toHaveBeenCalled();
    expect(mockProductVarietyRepository.saveProductVar).not.toHaveBeenCalled();
    expect(mockProductImageRepository.saveProductImage).not.toHaveBeenCalled();
    expect(mockProductTagRepository.saveProductTag).not.toHaveBeenCalled();
    expect(
      mockProductTagLinkRepository.saveProductTagLink,
    ).not.toHaveBeenCalled();
  });

  it('should delete a product and its dependencies correctly', async () => {
    const id = 1;

    await service.deleteProduct(id);

    expect(mockProductRepository.findProductById).toHaveBeenCalledWith(id);
    expect(mockProductVarietyRepository.delete).toHaveBeenCalledWith({
      product: { productId: id },
    });
    expect(mockProductImageRepository.delete).toHaveBeenCalledWith({
      product: { productId: id },
    });
    expect(mockProductTagLinkRepository.delete).toHaveBeenCalledWith({
      product: { productId: id },
    });
    expect(mockProductRepository.delete).toHaveBeenCalledWith({
      productId: id,
    });
  });
});
