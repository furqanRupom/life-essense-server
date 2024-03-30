"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = require("../errors/handleZodError");
const http_status_1 = __importDefault(require("http-status"));
/* create global error handler */
const globalErrorHandler = (error, req, res, next) => {
    let success = false;
    let message = (error === null || error === void 0 ? void 0 : error.message) || 'Something went wrong!';
    let errorDetails = (error === null || error === void 0 ? void 0 : error.message) || {};
    let stack = null;
    if (error instanceof zod_1.ZodError) {
        const cleanError = (0, handleZodError_1.handleZodError)(error);
        message = cleanError.message;
        errorDetails = cleanError.errorDetails;
    }
    return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success,
        message,
        errorDetails,
    });
};
exports.default = globalErrorHandler;
