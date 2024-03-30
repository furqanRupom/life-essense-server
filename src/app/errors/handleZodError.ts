import { ZodError } from 'zod';

export const handleZodError = (error: ZodError) => {
    console.log(error);

    const extractMessage: string[] = error.errors.map((err:any) => {
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
