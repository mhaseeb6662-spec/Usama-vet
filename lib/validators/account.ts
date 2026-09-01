import { z } from "zod";
import { normalizePakistanPhone } from "@/lib/validators/order";

const pakistanPhone = z
  .string()
  .trim()
  .min(1, "Mobile number is required.")
  .transform((value) => value.replace(/[\s-()]/g, ""))
  .refine((value) => /^((\+92)|(0092)|92|0)?3\d{9}$/.test(value), {
    message: "Enter a valid Pakistani mobile number (e.g. 03001234567).",
  });

export const registerCustomerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: pakistanPhone,
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const loginCustomerSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginCustomerInput = z.infer<typeof loginCustomerSchema>;

export { normalizePakistanPhone };
