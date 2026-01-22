import type { Cafe24Enum } from "@/types/common.js";

export interface CategoryTranslationSeo {
  meta_title?: string | null;
  meta_author?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
}

export interface CategoryTranslationDetail {
  language_code: string;
  translated?: Cafe24Enum;
  category_name?: string | null;
  seo?: CategoryTranslationSeo | null;
  updated_date?: string | null;
}

export interface CategoryTranslation {
  shop_no: number;
  category_no: number;
  translations: CategoryTranslationDetail[];
}

export interface CategoryTranslationsListResponse {
  categories: CategoryTranslation[];
}

export interface CategoryTranslationResponse {
  category: CategoryTranslation;
}

export interface ProductTranslationSeo {
  meta_title?: string | null;
  meta_author?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  meta_alt?: string | null;
}

export interface ProductTranslationOption {
  name: string;
  value: string[];
}

export interface ProductTranslationDetail {
  language_code: string;
  translated?: Cafe24Enum;
  product_name?: string | null;
  product_tag?: string | null;
  description?: string | null;
  mobile_description?: string | null;
  simple_description?: string | null;
  summary_description?: string | null;
  payment_info?: string | null;
  shipping_info?: string | null;
  exchange_info?: string | null;
  service_info?: string | null;
  product_material?: string | null;
  seo?: ProductTranslationSeo | null;
  options?: ProductTranslationOption[] | null;
  updated_date?: string | null;
}

export interface ProductTranslation {
  shop_no: number;
  product_no: number;
  product_name?: string;
  translations: ProductTranslationDetail[];
}

export interface ProductTranslationsListResponse {
  products: ProductTranslation[];
}

export interface ProductTranslationResponse {
  product: ProductTranslation;
}

export interface StoreTranslationDetail {
  language_code: string;
  translated?: Cafe24Enum;
  shop_name?: string | null;
  company_name?: string | null;
  company_registration_no?: string | null;
  president_name?: string | null;
  phone?: string | null;
  email?: string | null;
  fax?: string | null;
  zipcode?: string | null;
  address1?: string | null;
  address2?: string | null;
  customer_service_phone?: string | null;
  customer_service_hours?: string | null;
  privacy_officer_name?: string | null;
  privacy_officer_email?: string | null;
  updated_date?: string | null;
}

export interface StoreTranslation {
  shop_no: number;
  translations: StoreTranslationDetail[];
}

export interface StoreTranslationResponse {
  store: StoreTranslation;
}

export interface ThemeTranslationDetail {
  language_code: string;
  path: string;
}

export interface ThemeTranslationSummary {
  skin_no: number;
  translations: ThemeTranslationDetail[];
}

export interface ThemeTranslationsListResponse {
  themes: ThemeTranslationSummary[];
}

export interface ThemeSkinTranslation {
  language_code: string;
  path: string;
  source: string;
}

export interface ThemeTranslationDetailResponse {
  skin_no: number;
  skin_code: string;
  skin_translation: ThemeSkinTranslation;
}

export interface ThemeTranslationResponse {
  theme: ThemeTranslationDetailResponse;
}
