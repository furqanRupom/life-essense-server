"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (error) => {
    console.log(error);
    const extractMessage = error.errors.map((err) => {
        const path = err.path.join('.');
        return `${err.message}`;
    });
    return {
        success: false,
        message: extractMessage.join('. '),
        errorDetails: {
            issues: error.issues,
        },
    };
};
exports.handleZodError = handleZodError;
