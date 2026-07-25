import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  customer_number: z.string().min(1, "Customer number is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  contact_person: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  gst: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();
