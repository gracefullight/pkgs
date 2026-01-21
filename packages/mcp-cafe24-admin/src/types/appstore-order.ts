export type AppstoreOrderCurrency = "KRW" | "USD" | "JPY" | "PHP";
export type AppstoreAutomaticPayment = "T" | "F";

export interface AppstoreOrder {
  order_id: string;
  order_name: string;
  order_amount: string;
  currency: AppstoreOrderCurrency;
  return_url: string;
  automatic_payment: AppstoreAutomaticPayment;
  created_date?: string;
  confirmation_url?: string;
}

export interface AppstoreOrderCreateRequest {
  order_name: string;
  order_amount: string;
  return_url: string;
  automatic_payment?: AppstoreAutomaticPayment;
}

export interface AppstoreOrderGetResponse {
  order: AppstoreOrder;
}

export interface AppstoreOrderCreateResponse {
  order: AppstoreOrder;
}
