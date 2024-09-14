import {z} from "zod";

const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
});

export default ResetPasswordSchema;