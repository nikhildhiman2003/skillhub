import { z } from "zod";

export const createUserSchema = z
  .object({
    name : z
      .string()
      .trim()
      .min(2,"user name must be at least 2 characters")
      .max(20,"user name must be at most 20 characters"),
    
    email : z
        .string()
        .trim()
        .email("invalid email address"),

    password : z
        .string()
        .min(6,"password must be at least 6 characters")
        .max(20,"password must be atmost 20 characters"),

    role : z.enum(["CLIENT","FREELANCER","ADMIN"]),

})

    export type createUserInput = z.infer<typeof createUserSchema>

