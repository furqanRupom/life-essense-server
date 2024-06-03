import { Request, Response } from "express";
import catchAsync from "../../shared/catchAync";
import { metaServices } from "./meta.services";
import sendResponse from "../../shared/sendResponse";

const getAdminMetaData = catchAsync(async (req: Request, res: Response) => {
    const result = await metaServices.adminMetaData();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Fetched admin meta data successfully ",
        data: result
    })
})

export const metaController = {
    getAdminMetaData
}