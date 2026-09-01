import { z } from "zod";

const pakistanPhone = z
  .string()
  .trim()
  .min(1, "Mobile number is required.")
  .transform((value) => value.replace(/[\s-()]/g, ""))
  .refine((value) => /^((\+92)|(0092)|92|0)?3\d{9}$/.test(value), {
    message: "Enter a valid Pakistani mobile number (e.g. 03001234567).",
  });

const optionalPakistanPhone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-()]/g, ""))
  .refine((value) => value === "" || /^((\+92)|(0092)|92|0)?3\d{9}$/.test(value), {
    message: "Enter a valid WhatsApp number.",
  })
  .optional();

export const cartItemInputSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Quantity must be at least 1."),
});

export const cartQuoteSchema = z.object({
  items: z.array(cartItemInputSchema).min(1, "Your cart is empty."),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Full name is required."),
  phone: pakistanPhone,
  whatsapp: optionalPakistanPhone,
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().min(2, "City is required."),
  area: z.string().trim().optional(),
  address: z.string().trim().min(8, "Complete address is required."),
  landmark: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  paymentMethod: z.literal("COD"),
  items: z.array(cartItemInputSchema).min(1, "Your cart is empty."),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(6, "Order number is required."),
  phone: pakistanPhone,
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartQuoteInput = z.infer<typeof cartQuoteSchema>;

export function normalizePakistanPhone(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "");
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `+92${cleaned.slice(1)}`;
  }
  if (cleaned.length === 10 && cleaned.startsWith("3")) {
    return `+92${cleaned}`;
  }
  return value.trim();
}
