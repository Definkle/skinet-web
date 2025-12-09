import type { CreateProductDto, Product as ProductDto } from '@api-models';

import type { TRequired } from '@shared/types/generics.type';

export interface Product extends TRequired<ProductDto> {
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
    type: dto.type ?? '',
    brand: dto.brand ?? '',
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
