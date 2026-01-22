import type { Cafe24Enum, Cafe24PagingLinks } from "@/types/common.js";

export interface ShippingOrigin extends Record<string, unknown> {
  origin_code: string;
  origin_name: string;
  default: Cafe24Enum;
  contact: string;
  secondary_contact: string;
  zipcode: string;
  country_code: string;
  address1: string;
  address2: string;
  variants: string[] | null;
}

export interface ListShippingOriginsResponse {
  shippingorigins: ShippingOrigin[];
  links: Cafe24PagingLinks;
}

export interface RetrieveShippingOriginResponse {
  shippingorigin: ShippingOrigin;
  links?: Cafe24PagingLinks;
}

export interface CreateShippingOriginRequest {
  request: {
    origin_name: string;
    address1: string;
    address2: string;
    country_code: string;
    default?: Cafe24Enum;
    zipcode?: string;
    contact?: string;
    secondary_contact?: string;
  };
}

export interface CreateShippingOriginResponse {
  shippingorigin: ShippingOrigin;
}

export interface UpdateShippingOriginRequest {
  origin_code: string;
  request: {
    origin_name?: string;
    country_code?: string;
    default?: Cafe24Enum;
    contact?: string;
    secondary_contact?: string;
    zipcode?: string;
    address1?: string;
    address2?: string;
  };
}

export interface UpdateShippingOriginResponse {
  shippingorigin: ShippingOrigin;
}

export interface DeleteShippingOriginResponse extends Record<string, unknown> {
  shippingorigin: {
    origin_code: string;
  };
}
