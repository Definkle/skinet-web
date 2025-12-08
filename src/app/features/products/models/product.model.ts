import type { CreateProductDto, Product as ProductDto } from '@api-models';

// ===================================
// Domain Models
// ===================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
  quantity?: number;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type: string;
  brand: string;
  quantityInStock: number;
}

// ===================================
// Mappers
// ===================================

export function mapProductFromDto(dto: ProductDto): Product {
  if (!dto.id || !dto.name || dto.price === undefined) {
    throw new Error('Invalid product: missing required fields');
  }

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    price: dto.price,
    pictureUrl: dto.pictureUrl ?? '',
    type: dto.type ?? 'Unknown',
    brand: dto.brand ?? 'Unknown',
    quantityInStock: dto.quantityInStock ?? 0,
  };
}

export function mapProductToDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    pictureUrl: product.pictureUrl,
    type: product.type,
    brand: product.brand,
    quantityInStock: product.quantityInStock,
  };
}

export function mapCreateProductToDto(product: CreateProduct): CreateProductDto {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    pictureUrl: product.pictureUrl,
    type: product.type,
    brand: product.brand,
    quantityInStock: product.quantityInStock,
  };
}
