import {z} from "zod";

const NewPasswordSchema = z.object({
    password: z.string().min(5, {message: 'Password must be at least 5 characters'}),
    token: z.string().nullable().optional(),
});

export default NewPasswordSchema;