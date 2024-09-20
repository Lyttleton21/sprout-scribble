import * as z from 'zod'

export const reviewSchema = z.object({
    rating: z.number().min(1, {message: "Please add atleast one star!"}).max(5, {message: "maximum rating is 5 stars!"}),
    comment: z.string().min(10, {message: "Please add up to 10 chachacters for this review!"}),
    productID: z.number()
});