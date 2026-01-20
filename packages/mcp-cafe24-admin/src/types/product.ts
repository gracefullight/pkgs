export interface BundleProductComponent {
  product_no: number;
  product_name: string;
  purchase_quantity: number;
  product_code?: string;
  product_price?: string;
}

export interface BundleProduct {
  product_no: number;
  product_code: string;
  product_name: string;
  display: string;
  selling: string;
  price_content?: string;
  bundle_product_components?: BundleProductComponent[];
}

export interface Product {
  product_no: number;
  product_code: string;
  product_name: string;
  product_name_origin: string;
  description?: string;
  summary_description?: string;
  detail_description?: string;
  price: number;
  selling: boolean | string;
  display: boolean | string;
  stock: number;
  created_date: string;
  updated_date: string;
  selling_date_start?: string;
  selling_date_end?: string;
}

export interface ProductDiscountPrice {
  pc_discount_price: string;
  mobile_discount_price: string;
  app_discount_price: string;
}

export interface ProductIconImage {
  code: string;
  path?: string;
}

export interface ProductIcons {
  shop_no?: number;
  use_show_date?: string;
  show_start_date?: string;
  show_end_date?: string;
  image_list: ProductIconImage[];
}

export interface Category {
  category_no: number;
  category_name: string;
  full_category_name: string;
  category_depth: number;
  parent_category_no: number | null;
}

export interface MainProduct {
  shop_no: number;
  product_no: number;
  product_name: string;
  fixed_sort: boolean;
}

export interface MainProductOperationResult {
  shop_no: number;
  product_no: number | number[];
  fix_product_no?: number[];
}

export interface CategoryProduct {
  shop_no: number;
  product_no: number;
  sequence_no: number;
  auto_sort: boolean;
  sold_out: boolean;
  fixed_sort: boolean;
  not_for_sale: boolean;
}
