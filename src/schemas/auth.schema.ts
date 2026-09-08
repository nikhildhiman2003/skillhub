import { z } from "zod";

export const registerSchema = z
.object({ 
    name : z 
     .string()
     .trim()
     .min(2, "Name must be at least 2  Characters")
     .max(20,"Name must not be exceed 20 characters"),

    email : z
     .string()
     .email("Invalid email address")
     .transform((value) => value.toLowerCase().trim()),
   
    password : z
     .string()
     .min(8, "Password must be at least 8 characters"),

    role : z.enum(["CLIENT", "FREELANCER"]),
});

export type RegisterInput = z.infer<typeof registerSchema>; 

export const loginSchema = z
.object({
    
    email: z
     .string()
     .email("Invalid email address")
     .transform((value) => value.toLowerCase().trim()),
    
    password : z
     .string()
     .min(8,"Password must be atleast 8 characters"),
})

export type loginschemaInput = z.infer<typeof loginSchema> 
