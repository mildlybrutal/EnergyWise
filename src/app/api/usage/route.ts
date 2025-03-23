import { NextRequest, NextResponse } from "next/server";
import { parseUserLog, UserLog } from "@/lib/parser";
import dbConnect from "@/lib/dbConnect";
import UserLogModel from "@/models/UserLog";
import UserModel from "@/models/User";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const body = await request.json();
        const userId = body._id;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }
        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const inputWithUserId: UserLog = {
            ...body,
            userId,
        };

        const parsedLog = await parseUserLog(inputWithUserId);

        const newLog = new UserLogModel(parsedLog);
        await newLog.save();
    } catch (error) {
        return NextResponse.json(
            { error: "Unable to parse log" },
            { status: 400 }
        );
    }
}
