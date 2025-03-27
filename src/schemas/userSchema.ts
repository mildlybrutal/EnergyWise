import {z} from 'zod';


export const UserSchema = z.object({
    username: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
    created_at : z.date(),
})