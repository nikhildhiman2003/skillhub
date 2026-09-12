import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterInput } from "@/schemas/auth.schema";
import { loginInput } from "@/schemas/auth.schema";

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

export async function loginUser(data:loginInput){
    const user = await prisma.user.findUnique({
        where:{
            email : data.email
        }
    });
    if(!user){
        throw new Error("INVALID CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(
        data.password,
        user.password
    );

    if(!passwordMatches){
        throw new Error("INVALID CREDENTIALS");
    }

    const {password: _,...safeUser } = user;
    return safeUser
}