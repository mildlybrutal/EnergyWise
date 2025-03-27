import { authClient } from "@/lib/client";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: "An error occurred while signing in" },
            { status: 500 }
        );
    }
}
