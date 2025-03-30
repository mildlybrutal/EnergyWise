import { NextRequest, NextResponse } from "next/server";
import { parseUserLog, UserLog } from "@/lib/parser";
import dbConnect from "@/lib/dbConnect";
import UserLogModel from "@/models/UserLog";
import { Types } from "mongoose";
import UserModel from "@/models/User";
import { authClient } from "@/lib/client";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

interface AISuggestion {
    suggestion: string;
    potentialSavingsUnits: number;
    potentialCostSavings: number;
}

export async function POST(request: NextRequest) {
    await dbConnect();

    const sessionCookie = request.cookies.get("session_token");

    if (!sessionCookie) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const session = await auth.api.getSession({
            headers:await headers(),
        });
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid user ID" },
                { status: 400 }
            );
        }
        const user = await UserModel.findById(userId);
        console.log("User:", user);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const body = await request.json();

        const userLog = {
            userId: session.user.id,
            ...body,
            createdAt: new Date(),
        }

        const inputWithUserId: UserLog = {
            ...body,
            userId: user._id.toString(),
            createdAt: new Date(),
        };

        const parsedLog = await parseUserLog(inputWithUserId);

        const newLog = new UserLogModel(parsedLog);
        await newLog.save();

        const suggestions = await generateSuggestionsWithAI(parsedLog);

        return NextResponse.json(
            { message: "Log saved successfully", suggestions },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/logs:", error);
        return NextResponse.json(
            { error: "Unable to process request" },
            { status: 400 }
        );
    }
}

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const session = await authClient.getSession();
        if (!session || !session.data?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.data?.user.id;
        const logs = await UserLogModel.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}

async function generateSuggestionsWithAI(
    log: UserLog
): Promise<AISuggestion[]> {
    try {
        const { unitsUsed, perUnitCost, totalBill, createdAt } = log;

        const month = createdAt.getMonth();
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const currentMonth = monthNames[month];
        const isSummer = month >= 5 && month <= 9;
        const isWinter = month === 11 || month === 0 || month === 1;
        const season = isSummer ? "summer" : isWinter ? "winter" : "rainy";

        const prompt = `
            You are an energy-saving assistant. The user has provided the following electricity usage data:
            - Units Used: ${unitsUsed} kWh
            - Per Unit Cost: $${perUnitCost}
            - Total Bill: $${totalBill}
            - Current Month: ${currentMonth} (a ${season} season)

            Based on this data, provide 1-3 actionable suggestions to help the user save electricity. Consider the season when making suggestions (e.g., higher usage in summer due to cooling, higher usage in winter due to heating). For each suggestion, estimate the potential savings in units (kWh) as a percentage of the total units used and calculate the potential cost savings based on the per unit cost. Return the suggestions in the following JSON format:
            [
            {
                "suggestion": "A detailed suggestion",
                "potentialSavingsUnits": 50,
                "potentialCostSavings": 500
            }
            ]
            `;

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const generatedText = completion.choices[0]?.message?.content;
        if (!generatedText) {
            throw new Error("No response from the AI model");
        }

        let suggestions: AISuggestion[];
        try {
            suggestions = JSON.parse(generatedText);
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            suggestions = [
                {
                    suggestion:
                        "The AI model failed to generate a valid response. Consider reducing your electricity usage by turning off appliances when not in use.",
                    potentialSavingsUnits: Math.round(unitsUsed * 0.1),
                    potentialCostSavings: Math.round(
                        unitsUsed * 0.1 * perUnitCost
                    ),
                },
            ];
        }

        return suggestions;
    } catch (error) {
        console.error("Error generating AI suggestions:", error);
        return [
            {
                suggestion:
                    "Unable to generate AI suggestions at this time. Try reducing your electricity usage by using energy-efficient appliances.",
                potentialSavingsUnits: Math.round(log.unitsUsed * 0.1),
                potentialCostSavings: Math.round(
                    log.unitsUsed * 0.1 * log.perUnitCost
                ),
            },
        ];
    }
}
