import {z} from "zod";

const VariantSchema = z.object({
    productID: z.string(),
    id: z.number().optional(),
    color: z
    .string()
    .min(3, { message: "Color must be at least 3 characters long" }),
    editMode: z.boolean(),
    productType: z.string().min(3, {message: "Product type must be at least 3 characters long"}),
    tags: z.array(z.string()).min(3, {message: "You must provide atleast 1 tag"}),
    variantImage: z.array(z.object({
        url: z.string().refine((url) => url.search('blob:') !== 0, {message: "Please wait for the image to upload"}),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
    }))
});

export default VariantSchema;