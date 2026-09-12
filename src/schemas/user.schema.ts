import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z 
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["CLIENT", "FREELANCER", "ADMIN"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;