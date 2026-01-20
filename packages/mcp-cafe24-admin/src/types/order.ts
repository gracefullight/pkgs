import type { SalesStat, SummaryStat } from "./store.js";

export interface DailySales {
  date: string;
  sales_count: number;
  sales_amount: number;
}

export interface Order {
  order_id: string;
  order_name: string;
  order_status_code: string;
  order_status_name: string;
  payment_status: string;
  payment_status_name: string;
  settle_amount: number;
  currency: string;
  order_date: string;
  customer_id: string;
  customer_name: string;
}

export interface OrderStatus {
  status_name_id: number;
  status_type: string;
  basic_name: string;
  custom_name?: string;
  reservation_custom_name?: string;
}

export interface SubscriptionShipment {
  shop_no: number;
  subscription_no: number;
  subscription_shipments_name: string;
  product_binding_type: string;
  one_time_purchase: string;
  use_discount: string;
  subscription_shipments_cycle?: string[];
}

export interface ShippingInfo {
  key: string;
  use: string;
  required: string;
}

export interface PrintType {
  invoice_print?: string;
  receipt_print?: string;
  address_print?: string;
}

export interface OrderFormSetting {
  shop_no?: number;
  buy_limit_type?: string;
  guest_purchase_button_display?: string;
  junior_purchase_block?: string;
  reservation_order?: string;
  discount_amount_display?: string;
  order_item_delete?: string;
  quick_signup?: string;
  check_order_info?: string;
  order_form_input_type?: string;
  shipping_info?: ShippingInfo[];
  order_info?: ShippingInfo[];
  china_taiwan_id_input?: string;
  print_type?: PrintType;
  orderform_additional_enabled?: string;
}

export type { SalesStat, SummaryStat };
