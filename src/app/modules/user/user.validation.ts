import { z } from "zod"

const userSchemaValidation = z.object({
    body: z.object({
        name: z.string({
            required_error: "name is required"
        }),
        email: z.string({
            required_error: "email is required"
        }).email({
            message:"Please enter a valid email address"
        }),
        password: z.string({
            required_error: "password is required"
        }),
        bloodType: z.string({
            required_error: "bloodType is required"
        }),
        location: z.string({
            required_error: "location is required"
        }),
        age: z.number({
            required_error: "age is required"
        }),
        bio: z.string().optional(),
        lastDonationDate: z.string({
            required_error: "lastDonationDate is required"
        }),
    })
});


export const userValidation = {
    userSchemaValidation
}