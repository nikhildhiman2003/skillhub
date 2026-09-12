import { registerSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        const body = await request.json();

        const result = registerSchema.safeParse(body);

        if(!result.success){
            return NextResponse.json(
                {
                    success: false,
                    message :"Validation failed",
                    errors : result.error.flatten().fieldErrors,
                },
                {status : 400}
            );
        }
        const user = await registerUser(result.data);

        return NextResponse.json({
            success:true,
            message:"Registration successful",
            user,
        },
         {status : 201}
        );
    } catch(error){
        if(
            error instanceof Error &&
            error.message === "EMAIL_ALREADY_EXISTS"
        ){
            return NextResponse.json({
                success : false,
                message : "Email already registered",
            },
            {status : 409}
        );
    }
  
    console.error("REGISTER_ERROR:",error);
    
    return NextResponse.json({
        success:false,
        message:"Registration failed",
    },
    {status:500}
);
}
}