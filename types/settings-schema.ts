
import {z} from "zod";

const SettingsSchema = z.object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(5, {message: 'Password must be at least 5 characters'})),
    newPassword:z.optional(z.string().min(5))
}).refine(data => {
    if(data.password && !data.newPassword){
        return false;
    }
    return true;
}, {message: 'New Password is required', path:['newPassword']})

export default SettingsSchema;