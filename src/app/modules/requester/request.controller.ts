import httpStatus from "http-status";
import catchAsync from "../../shared/catchAync";
import sendResponse from "../../shared/sendResponse";
import { Request, Response } from "express";
import { requestServices } from "./request.service";
import { userFilterableFields } from "./request.constant";
import pick from "../../shared/pick";


const retrieveDonors = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortOrder', 'sortBy'])


    const result = await requestServices.retrieveAllDonors(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donors successfully found",
        meta: result.meta,
        data: result.data
    })
})

export const requestController = {
    retrieveDonors
}
