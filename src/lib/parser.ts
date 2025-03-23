import { z } from "zod";
import { UserLogSchema } from "@/schemas/userLog";

export type UserLog = z.infer<typeof UserLogSchema>;

export async function parseUserLog(input: unknown): Promise<UserLog> {
    try {
        const parsedInput = UserLogSchema.parse(input);
        return parsedInput;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors.map((e) => e.message).join(", "));
        }
        throw new Error("An error occurred while parsing the user log");
    }
}
