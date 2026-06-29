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

    phone: z
      .string()
      .refine(
        (val) => val === "" || /^\d{10}$/.test(val),
        "Enter a valid 10-digit phone number"
      ),

    billing: AddressSchema,

    shipping: AddressSchema,

    sameAsBilling: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasEmail = data.email.trim().length > 0;
    const hasPhone = data.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: "custom",
        message: "Provide at least an email or phone number",
        path: ["email"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Provide at least an email or phone number",
        path: ["phone"],
      });
      return;
    }

    if (!hasEmail && hasPhone && !/^\d{10}$/.test(data.phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid 10-digit phone number",
        path: ["phone"],
      });
    }

    if (!hasPhone && hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid email",
        path: ["email"],
      });
    }
  });

export type CustomerSchemaType = z.infer<typeof CustomerSchema>;