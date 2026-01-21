export type CustomerEventType = "E" | "P" | "L";
export type CustomerEventItem = "zipcode" | "address" | "cellphone" | "password" | "sms" | "email";

export interface CustomerEvent {
  shop_no: number;
  no: number;
  type: CustomerEventType;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_date: string;
  items: CustomerEventItem[] | null;
  reward_condition: "O" | "A" | null;
  agree_restriction: "T" | "F" | null;
  agree_restriction_period: number | null;
  auto_reward: "T" | "F";
  use_point: "T" | "F" | null;
  point_amount: string | null;
  use_coupon: "T" | "F" | null;
  coupon_no: string | null;
  popup_notification: "T" | "F" | null;
  status?: string | null;
}

export interface CustomerEventLink {
  rel: string;
  href: string;
}

export interface CustomerEventsListResponse {
  customerevents: CustomerEvent[];
  links?: CustomerEventLink[];
}

export interface CustomerEventCreateRequest {
  shop_no?: number;
  request: {
    type: CustomerEventType;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    items?: CustomerEventItem[];
    reward_condition?: "O" | "A";
    agree_restriction?: "T" | "F";
    agree_restriction_period?: number;
    auto_reward?: "T" | "F";
    use_point?: "T" | "F";
    point_amount?: string;
    use_coupon?: "T" | "F";
    coupon_no?: string;
    popup_notification?: "T" | "F";
  };
}

export interface CustomerEventCreateResponse {
  customerevent: CustomerEvent;
}

export interface CustomerEventStatusUpdateRequest {
  shop_no?: number;
  request: {
    no: number[];
    status: "S" | "D";
  };
}

export interface CustomerEventStatusUpdateResponse {
  customerevent: {
    shop_no: number;
    no: number[];
    status: "S" | "D";
  };
}
