"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidation = void 0;
const zod_1 = require("zod");
const requestSchemaValidation = zod_1.z.object({
    body: zod_1.z.object({
        donorId: zod_1.z.string({
            required_error: "donnerId is required"
        }),
        phoneNumber: zod_1.z.string({
            required_error: "phoneNumber is required"
        }),
        dateOfDonation: zod_1.z.string({
            required_error: "dateOfDonation is required"
        }),
        hospitalName: zod_1.z.string({
            required_error: "hospitalName is required"
        }),
        hospitalAddress: zod_1.z.string({
            required_error: "hospitalAddress is required"
        }),
        reason: zod_1.z.string({
            required_error: "reason is required"
        }),
    })
});
exports.requestValidation = {
    requestSchemaValidation
};
