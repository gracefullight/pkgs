import { z } from "zod";

export const ListShippingOriginsSchema = z
  .object({
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .optional()
      .default(0)
      .describe("Start location of list"),
    limit: z.number().int().min(1).max(100).optional().default(10).describe("Limit"),
  })
  .strict();

export const RetrieveShippingOriginSchema = z
  .object({
    origin_code: z
      .string()
      .length(8)
      .regex(/^[A-Z0-9]+$/)
      .describe("Shipping origin code"),
  })
  .strict();

export const CreateShippingOriginSchema = z
  .object({
    request: z
      .object({
        origin_name: z.string().max(50).describe("Shipping origin name"),
        address1: z.string().max(255).describe("Address 1"),
        address2: z.string().max(255).describe("Address 2"),
        country_code: z.string().length(2).describe("Country code"),
        default: z
          .enum(["T", "F"])
          .optional()
          .default("F")
          .describe("Check whether the shipping origin is set as default"),
        zipcode: z.string().min(2).max(14).optional().describe("Zipcode"),
        contact: z.string().max(20).optional().describe("Primary contact"),
        secondary_contact: z.string().max(20).optional().describe("Secondary contact"),
      })
      .strict(),
  })
  .strict();

export const UpdateShippingOriginSchema = z
  .object({
    origin_code: z
      .string()
      .length(8)
      .regex(/^[A-Z0-9]+$/)
      .describe("Shipping origin code"),
    request: z
      .object({
        origin_name: z.string().max(50).optional().describe("Shipping origin name"),
        country_code: z.string().length(2).optional().describe("Country code"),
        default: z
          .enum(["T", "F"])
          .optional()
          .describe("Check whether the shipping origin is set as default"),
        contact: z.string().max(20).optional().describe("Primary contact"),
        secondary_contact: z.string().max(20).optional().describe("Secondary contact"),
        zipcode: z.string().min(2).max(14).optional().describe("Zipcode"),
        address1: z.string().max(255).optional().describe("Address 1"),
        address2: z.string().max(255).optional().describe("Address 2"),
      })
      .strict(),
  })
  .strict();

export const DeleteShippingOriginSchema = z
  .object({
    origin_code: z
      .string()
      .length(8)
      .regex(/^[A-Z0-9]+$/)
      .describe("Shipping origin code"),
  })
  .strict();

export type ListShippingOrigins = z.infer<typeof ListShippingOriginsSchema>;
export type RetrieveShippingOrigin = z.infer<typeof RetrieveShippingOriginSchema>;
export type CreateShippingOrigin = z.infer<typeof CreateShippingOriginSchema>;
export type UpdateShippingOrigin = z.infer<typeof UpdateShippingOriginSchema>;
export type DeleteShippingOrigin = z.infer<typeof DeleteShippingOriginSchema>;
