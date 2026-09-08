import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/schemas/auth.schema";

export async function registerUser(data :RegisterInput){
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if(existingUser){
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data:{
            name : data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        }
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
}