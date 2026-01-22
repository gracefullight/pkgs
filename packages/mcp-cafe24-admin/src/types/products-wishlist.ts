export interface WishlistCustomer {
  shop_no: number;
  member_id: string;
}

export interface WishlistCustomersResponse {
  customers: WishlistCustomer[];
}

export interface WishlistCountResponse {
  count: number;
}
