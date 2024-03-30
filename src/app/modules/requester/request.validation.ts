import { z } from "zod";

const requestSchemaValidation = z.object({
    body:z.object({
        donorId:z.string({
            required_error: "donnerId is required"
        }),
        phoneNumber:z.string({
            required_error: "phoneNumber is required"
        }),
        dateOfDonation : z.string({
            required_error: "dateOfDonation is required"
        }),
        hospitalName: z.string({
            required_error: "hospitalName is required"
        }),
        hospitalAddress: z.string({
            required_error: "hospitalAddress is required"
        }),
        reason:z.string({
            required_error: "reason is required"
        }),
    })
})


export const requestValidation = {
  requestSchemaValidation
}