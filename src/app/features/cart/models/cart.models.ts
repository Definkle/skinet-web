import type { CartItem as CartItemDto, ShoppingCart as ShoppingCartDto } from '@api-models';

import type { TRequired } from '@shared/types/generics.type';

export interface CartItem extends TRequired<CartItemDto> {}

export interface ShoppingCart extends TRequired<ShoppingCartDto> {
  items: CartItem[];
}

export function mapCartItemFromDto(dto: CartItemDto): CartItem {
  if (!dto.productId || !dto.productName || dto.productPrice === undefined || !dto.quantity) {
    throw new Error(`Invalid cart item: missing required fields. Received: ${JSON.stringify(dto)}`);
  }

  return {
    productId: dto.productId,
    productName: dto.productName,
    productPrice: dto.productPrice,
    quantity: dto.quantity,
    pictureUrl: dto.pictureUrl ?? '',
    brand: dto.brand ?? '',
    type: dto.type ?? '',
  };
}

export function mapCartFromDto(dto: ShoppingCartDto): ShoppingCart {
  if (!dto.id) {
    throw new Error('Invalid shopping cart: missing id');
  }

  return {
    id: dto.id,
    items: dto.items?.map(mapCartItemFromDto) ?? [],
    deliveryMethodId: dto.deliveryMethodId ?? null,
    clientSecret: dto.clientSecret ?? null,
    paymentIntentId: dto.paymentIntentId ?? null,
  };
}

export function mapCartItemToDto(item: CartItem): CartItemDto {
  return {
    productId: item.productId,
    productName: item.productName,
    productPrice: item.productPrice,
    quantity: item.quantity,
    pictureUrl: item.pictureUrl,
    brand: item.brand,
    type: item.type,
  };
}

export function mapCartToDto(cart: ShoppingCart): ShoppingCartDto {
  return {
    id: cart.id,
    items: cart.items.map(mapCartItemToDto),
    deliveryMethodId: cart.deliveryMethodId,
    clientSecret: cart.clientSecret,
    paymentIntentId: cart.paymentIntentId,
  };
}

export class Cart implements ShoppingCart {
  vouchers = [];
  id = crypto.randomUUID();
  items = [];
  deliveryMethodId = null;
  clientSecret = null;
  paymentIntentId = null;
}
