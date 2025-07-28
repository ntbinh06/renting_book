import { db } from "@/lib/db";
import { hash } from 'bcrypt';
import { NextResponse } from "next/server";
export async function POST(req: Request){
    try {
        const body = await req.json();
        const {email, name, password} = body

        const existingUserByEmail = await db.user.findUnique({
            where: {email: email}
        })
        if(existingUserByEmail){
            return NextResponse.json({user: null, message: "User with this email already exists"})
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await db.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
                role: "borrower",
            }
        })

        const { password: newUserPassword, ...rest} =newUser;
        return NextResponse.json({user: newUser, message: "User created successfully"},{status: 201})
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({message: "Something just went wrong"},{status: 500})
    }
}
