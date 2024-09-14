import {z} from "zod";

const LoginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(5, {message: 'Password must be at least 5 characters'}),
    code: z.optional(z.string())
});

export default LoginSchema;