import { z } from "zod";

export const UserLogSchema = z.object({
    userId: z.string().uuid(),
    unitsUsed: z.number().int(),
    perUnitCost: z.number().int(),
    totalBill: z.number().int(),
    createdAt: z.date(),
})