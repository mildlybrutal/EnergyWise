import { authClient } from "@/lib/client";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error:any) {
        return NextResponse.json(
            { error: "An error occurred while signing up" },
            { status: 500 }
        );
    }
}
