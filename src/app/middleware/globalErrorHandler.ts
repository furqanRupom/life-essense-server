import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { handleZodError } from '../errors/handleZodError';
import httpStatus from 'http-status';


/* create global error handler */

const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let success: boolean = false;
    let message: string = error?.message || 'Something went wrong!';
    let errorDetails =  error?.message || {};
    let stack: unknown = null;
    if (error instanceof ZodError) {
        const cleanError = handleZodError(error);
        message = cleanError.message;
        errorDetails = cleanError.errorDetails;
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success,
        message,
        errorDetails,
    });
};
export default globalErrorHandler;
