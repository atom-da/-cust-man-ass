import { z } from "zod";

export const AddressSchema = z.object({
  address1: z
    .string()
    .min(3, "Address is required"),

  address2: z.string().optional(),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter valid pincode"),
});

export const CustomerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "Minimum 3 characters"),

    lastName: z
      .string()
      .min(2, "Minimum 2 characters"),

    email: z
      .string()
      .refine(
        (val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email"
      ),

    phone: z.string(),

    billing: AddressSchema,

    shipping: AddressSchema,

    sameAsBilling: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Email or phone required

    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: "custom",
        message: "Either Email or Phone is required",
        path: ["email"],
      });
    }
  });

export type CustomerSchemaType = z.infer<typeof CustomerSchema>;