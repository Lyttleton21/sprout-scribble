import {z} from "zod";

const RegisterSchema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(5, {message: 'Password must be at least 5 characters'})
});

export default RegisterSchema;