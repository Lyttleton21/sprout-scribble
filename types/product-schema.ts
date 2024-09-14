import {z} from "zod";

export const ProductSchema = z.object({
    id: z.string().optional(),
    title:z.string().min(5, {
        message: "Title Must be atleast 5 characters long.",
    }),
    description:z.string().min(40, {
        message: "Description Must be atleast 40 characters long."
    }),
    price: z.coerce
    .number({invalid_type_error:"Price must ba a Number"})
    .positive({message: "Price Must be a Positive number."}),
});