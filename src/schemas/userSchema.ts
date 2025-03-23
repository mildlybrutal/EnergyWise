import {z} from 'zod';


export const UserSchema = z.object({
    username: z.string().min(3).max(255),
    email: z.string().email(),
    created_at : z.date(),
})