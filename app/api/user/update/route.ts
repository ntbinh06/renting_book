import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if(!session || !session.user?.email){
        return NextResponse.json({ success: false, message: "Chưa đăng nhập"})
    }

    const body = await req.json();

    try {
        const updated = await db.user.update({
            where: {email: session.user.email},
            data: {
                user_name: body.user_name,
                address: body.address,
                numberphone: body.numberphone,
                avatar: body.avatar,
                delivery: body.delivery ?? null,
            }
        })

        return NextResponse.json({success: true, user: updated})
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        return NextResponse.json({success: false, message:"Cập nhật thất bại"})
    }
}