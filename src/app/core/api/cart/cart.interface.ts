export interface ICartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface IVoucher {
  code: string;
  discount: number;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  discount: number;
  deliveryFee: number;
  vouchers: IVoucher[];
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
