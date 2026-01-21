export interface CustomerMemo {
  shop_no: number;
  memo_no: number;
  author_id: string;
  memo: string;
  important_flag: "T" | "F";
  created_date: string;
}

export type CustomerMemosResponse = {
  memos: CustomerMemo[];
};

export type CustomerMemoResponse = {
  memo: CustomerMemo;
};

export type CustomerMemosCountResponse = {
  count: number;
};

export interface ListCustomerMemosParams {
  shop_no?: number;
  member_id: string;
  start_date?: string;
  end_date?: string;
  important_flag?: "T" | "F";
  memo?: string;
  offset?: number;
  limit?: number;
}

export interface CountCustomerMemosParams {
  shop_no?: number;
  member_id: string;
}

export interface RetrieveCustomerMemoParams {
  shop_no?: number;
  member_id: string;
  memo_no: number;
}

export interface CreateCustomerMemoRequest {
  author_id: string;
  memo: string;
  important_flag?: "T" | "F";
}

export interface CreateCustomerMemoParams {
  shop_no?: number;
  member_id: string;
  request: CreateCustomerMemoRequest;
}

export interface UpdateCustomerMemoRequest {
  author_id: string;
  memo?: string;
  important_flag?: "T" | "F";
}

export interface UpdateCustomerMemoParams {
  shop_no?: number;
  member_id: string;
  memo_no: number;
  request: UpdateCustomerMemoRequest;
}

export interface DeleteCustomerMemoParams {
  shop_no?: number;
  member_id: string;
  memo_no: number;
}
