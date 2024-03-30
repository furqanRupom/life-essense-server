"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "name is required"
        }),
        email: zod_1.z.string({
            required_error: "email is required"
        }).email({
            message: "Please enter a valid email address"
        }),
        password: zod_1.z.string({
            required_error: "password is required"
        }),
        bloodType: zod_1.z.string({
            required_error: "bloodType is required"
        }),
        location: zod_1.z.string({
            required_error: "location is required"
        }),
        age: zod_1.z.number({
            required_error: "age is required"
        }),
        bio: zod_1.z.string().optional(),
        lastDonationDate: zod_1.z.string({
            required_error: "lastDonationDate is required"
        }),
    })
});
exports.userValidation = {
    userSchemaValidation
};
