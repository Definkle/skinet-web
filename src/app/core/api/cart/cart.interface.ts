export interface ICartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  discount: number;
  deliveryFee: number;
}

export interface ICartResponse {
  id: string;
  items: ICartItem[];
}

export interface IUpdateCartParams {
  id: string;
  items: ICartItem[];
}

export interface IDeleteCartResponse {}
