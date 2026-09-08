import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { CreateUserInput } from '@/schemas/user.schema';

export async function getUser(){
    return prisma.user.findMany({
        orderBy:{
            createdAt: 'desc'
        }
    });
}   

export async function createUser(data: CreateUserInput){
    const existingUser = await prisma.user.findUnique({
        where:{
            email: data.email
        }
    });

    if(existingUser){
        throw new Error('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data:{
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        }
    });

    const { password : _, ...safeUser } = user;
    return safeUser;
}  