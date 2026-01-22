import { z } from "zod";

export const ProductWishlistCustomersSchema = z
  .object({
    product_no: z.number().describe("Product number"),
    shop_no: z.number().optional().default(1).describe("Shop Number"),
  })
  .strict();

export type ProductWishlistCustomersParams = z.infer<typeof ProductWishlistCustomersSchema>;
