export interface SalesVolume extends Record<string, unknown> {
  shop_no: string;
  collection_date: string;
  collection_hour: string;
  product_price: string;
  product_option_price: string;
  settle_count: string;
  exchane_product_count: string;
  cancel_product_count: string;
  return_product_count: string;
  updated_date: string;
  product_no: number;
  variants_code: string;
  total_sales: string;
}

export interface SalesVolumeResponse {
  salesvolume: SalesVolume[];
}
