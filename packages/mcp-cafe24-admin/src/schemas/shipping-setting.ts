import { z } from "zod";

const Cafe24EnumSchema = z.enum(["T", "F"]);

export const ShippingPeriodSchema = z.object({
  minimum: z.number().int().describe("Minimum shipping period"),
  maximum: z.number().int().describe("Maximum shipping period"),
});

export const ShippingRateSchema = z.object({
  min_value: z.string().describe("Minimum value"),
  max_value: z.string().describe("Maximum value"),
  shipping_fee: z.string().describe("Shipping fee"),
});

export const OverseaShippingCountrySchema = z.object({
  country_code: z.string().describe("Country code"),
});

export const CountryShippingFeeSchema = z.object({
  country_code: z.string().describe("Country code"),
  conditional: z.enum(["price", "quantity"]).describe("Conditional"),
  min_value: z.string().describe("Minimum value"),
  max_value: z.string().describe("Maximum value"),
  shipping_fee: z.string().describe("Shipping fee"),
});

export const ReturnAddressSchema = z.object({
  zipcode: z.string().describe("Zipcode"),
  ziptype: z.string().describe("Zipcode type (KOR, JPN, VNM, PHL, etc.)"),
  address1: z.string().describe("Address 1"),
  address2: z.string().describe("Address 2"),
});

export const PackageVolumeSchema = z.object({
  width: z.string().describe("Width"),
  length: z.string().describe("Length"),
  height: z.string().describe("Height"),
});

export const WishedDeliveryDateSchema = z.object({
  use: Cafe24EnumSchema.describe("Whether to use desired delivery date"),
  range: z
    .object({
      minimum: z.number().int().describe("Minimum range"),
      maximum: z.number().int().describe("Maximum range"),
    })
    .describe("Range"),
  default: z
    .object({
      minimum: z.number().int().nullable().describe("Default minimum"),
      use_fast_delivery: Cafe24EnumSchema.describe("Whether to use fast delivery"),
    })
    .describe("Default"),
});

export const WishedDeliveryTimeRangeSchema = z.object({
  start_hour: z.string().describe("Start hour (HH)"),
  end_hour: z.string().describe("End hour (HH)"),
});

export const WishedDeliveryTimeSchema = z.object({
  use: Cafe24EnumSchema.describe("Whether to use desired delivery time"),
  range: z.array(WishedDeliveryTimeRangeSchema).describe("Range list"),
  default: z
    .object({
      range: WishedDeliveryTimeRangeSchema.describe("Default range"),
      use_fast_delivery: Cafe24EnumSchema.describe("Whether to use fast delivery"),
    })
    .describe("Default"),
});

export const CountryHsCodeSchema = z.object({
  hs_code: z.string().describe("HS code"),
  country_code: z.string().describe("Country code"),
});

export const OverseaAdditionalFeeSchema = z.object({
  country_code: z.string().describe("Country code"),
  fee_name: z.string().describe("Fee name"),
  min_value: z.string().describe("Minimum value"),
  max_value: z.string().describe("Maximum value"),
  additional_fee: z.string().describe("Additional fee"),
  unit: z.enum(["W", "P"]).describe("Currency unit (W: Fixed amount, P: Percentage)"),
  rounding_unit: z
    .enum(["F", "0", "1", "2", "3"])
    .describe("Rounding place (F: Do not round, 0: KRW 1, 1: KRW 10, 2: KRW 100, 3: KRW 1000)"),
  rounding_rule: z
    .enum(["L", "U", "C"])
    .describe("Rounding option (L: round down, U: round, C: round up)"),
});

export const ApplicableSupplierSchema = z.object({
  supplier_code: z.string().describe("Supplier code"),
  supplier_id: z.string().describe("Supplier ID"),
});

export const ShippingCompanyTypeSchema = z.object({
  carrier_id: z.number().int().describe("Carrier ID"),
  is_selected: Cafe24EnumSchema.describe("Whether selected"),
  shipping_carrier_code: z.string().describe("Shipping carrier code"),
  shipping_type: z.string().describe("Shipping type"),
  shipping_carrier: z.string().describe("Shipping carrier name"),
});

export const RetrieveShippingSettingSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
  })
  .strict();

export const UpdateShippingSettingSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    request: z
      .object({
        shipping_method: z
          .enum([
            "shipping_01",
            "shipping_02",
            "shipping_04",
            "shipping_05",
            "shipping_06",
            "shipping_07",
            "shipping_08",
            "shipping_09",
            "shipping_10",
          ])
          .optional()
          .describe("Shipping method"),
        shipping_etc: z.string().max(25).optional().nullable().describe("Other shipping methods"),
        shipping_type: z
          .enum(["A", "C", "B"])
          .optional()
          .describe("Domestic/International shipping"),
        international_shipping_fee_criteria: z
          .enum(["B", "E"])
          .optional()
          .nullable()
          .describe("International shipping fee type (B: Store-assigned, E: EMS)"),
        shipping_place: z.string().optional().nullable().describe("Shipping area"),
        shipping_period: ShippingPeriodSchema.optional().describe("Shipping period"),
        product_weight: z.string().optional().describe("Product weight (0-30)"),
        shipping_fee_type: z
          .enum(["T", "R", "M", "D", "W", "C", "N"])
          .optional()
          .describe("Shipping fee type"),
        shipping_fee: z.string().optional().nullable().describe("Shipping fee"),
        free_shipping_price: z.string().optional().nullable().describe("Free shipping threshold"),
        shipping_fee_by_quantity: z
          .string()
          .optional()
          .nullable()
          .describe("Quantity-based shipping rates"),
        shipping_rates: z
          .array(ShippingRateSchema)
          .optional()
          .nullable()
          .describe("Advanced shipping rates"),
        shipping_fee_criteria: z
          .enum(["D", "L", "A", "R"])
          .optional()
          .describe("Shipping fee criteria"),
        prepaid_shipping_fee: z
          .enum(["C", "P", "B"])
          .optional()
          .describe("POD / Prepayment settings (C: POD, P: Prepay, B: Both)"),
        oversea_shipping_country: Cafe24EnumSchema.optional().describe(
          "Settings for shipping countries",
        ),
        oversea_shipping_country_list: z
          .array(OverseaShippingCountrySchema)
          .optional()
          .nullable()
          .describe("Shipping country list"),
        country_shipping_fee: Cafe24EnumSchema.optional().describe(
          "Settings for shipping fee by country",
        ),
        country_shipping_fee_list: z
          .array(CountryShippingFeeSchema)
          .optional()
          .nullable()
          .describe("Shipping fee by country list"),
        international_shipping_insurance: Cafe24EnumSchema.optional().describe(
          "International shipping insurance",
        ),
        return_address: ReturnAddressSchema.optional().describe("Return address"),
        package_volume: PackageVolumeSchema.optional().describe("Parcel specifications"),
        individual_shipping_fee: Cafe24EnumSchema.optional().describe(
          "Individual shipping fee settings by product",
        ),
        individual_fee_calculation_type: z
          .enum(["P", "I"])
          .optional()
          .nullable()
          .describe("Base for individual shipping fee calculation (P: Per product, I: Per item)"),
        additional_shipping_fee: z
          .string()
          .optional()
          .nullable()
          .describe("Additional shipping fee"),
        hs_code: z.string().max(20).optional().nullable().describe("HS code"),
        country_hs_code: z
          .array(CountryHsCodeSchema)
          .max(29)
          .optional()
          .nullable()
          .describe("HS code by country"),
        oversea_additional_fee: Cafe24EnumSchema.optional().describe(
          "Additional handling fee for international shipping",
        ),
        oversea_additional_fee_list: z
          .array(OverseaAdditionalFeeSchema)
          .max(500)
          .optional()
          .nullable()
          .describe("Applicable countries for additional handling fee"),
      })
      .strict(),
  })
  .strict();

export type RetrieveShippingSetting = z.infer<typeof RetrieveShippingSettingSchema>;
export type UpdateShippingSetting = z.infer<typeof UpdateShippingSettingSchema>;
