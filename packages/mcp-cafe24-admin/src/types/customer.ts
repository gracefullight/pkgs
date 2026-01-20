export interface Point {
  point_id: string; // ID might be string or number? usually string check code
  member_id: string;
  member_name: string;
  point_type: string;
  point: number;
  point_date: string;
}

export interface User {
  member_id: string;
  user_id: string;
  user_name: string;
  email: string;
  status: string;
  group: string;
}

export interface Customer {
  member_id: string;
  member_name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
  join_date: string;
  group?: string;
}

export interface CustomerSetting {
  shop_no: number;
  simple_member_join: string;
  member_authentication: string;
  minimum_age_restriction: string;
  adult_age_restriction: string;
  adult_purchase_restriction: string;
  adult_image_restriction: string;
  gender_restriction: string;
  member_rejoin_restriction: string;
  member_rejoin_restriction_day: number;
  password_authentication: string;
  member_join_confirmation: string;
  email_duplication: string;
  password_recovery: string;
  link_social_account: string;
  save_member_id: string;
  unregistration_admin_approval: string;
  unregistration_reason: string;
  display_group: string;
  join_standard: string;
  use_update_birthday: string;
}

export interface DormantAccount {
  shop_no?: number;
  use: string;
  notice_send_automatic: string;
  send_sms: string;
  send_email: string;
  point_extinction: string;
}

export interface PrivacyAgreement {
  no: number;
  name: string;
  shop_no?: number;
  use: string;
  required?: string;
  display?: string[];
  content?: string;
  save_type?: string;
  use_member?: string;
  use_non_member?: string;
}

export interface Policy {
  shop_no?: number;
  privacy_all?: string;
  terms_using_mall?: string;
  use_privacy_join?: string;
  privacy_join?: string;
  use_withdrawal?: string;
  required_withdrawal?: string;
  withdrawal?: string;
}
