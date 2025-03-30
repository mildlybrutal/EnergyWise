import { NextRequest, NextResponse } from "next/server";
import { authClient } from "@/lib/client";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const session = await authClient.getSession();
        if (!session || !session.data?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await UserModel.findById(session.data?.user.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user._id,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}