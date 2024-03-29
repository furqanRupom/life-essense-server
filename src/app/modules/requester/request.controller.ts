import httpStatus from "http-status";
import catchAsync from "../../shared/catchAync";
import sendResponse from "../../shared/sendResponse";
import { Request, Response } from "express";
import { requestServices } from "./request.service";


const retrieveDonors = catchAsync(async (req: Request, res: Response) => {
    const result = await requestServices.retrieveAllDonors();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieve all donars successfully",
        data: result
    })
})

export const requestController = {
    retrieveDonors
}
