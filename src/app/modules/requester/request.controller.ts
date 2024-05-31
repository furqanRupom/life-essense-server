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
       console.log(filters)

    const result = await requestServices.retrieveAllDonors(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donors successfully found",
        meta: result.meta,
        data: result.data
    })
})


const requestBloodDonation = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;

   
    const result = await requestServices.requestBloodDonation(req.body,token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Request successfully made",
        data: result
    })
})


const getBloodDonation = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await requestServices.getBloodDonations( token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation requests retrieved successfully",
        data: result
    })
})

const getDonorRequests = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await requestServices.getDonorRequests(token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donor requests retrieved successfully",
        data: result
    })
})



const updateRequestStatus = catchAsync(async (req: Request, res: Response) => {

    const token  = req.headers.authorization;
    const requestId = req.params.requestId;
    const result = await requestServices.updateRequestStatus(req.body,token as string, requestId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Donation request status successfully updated",
        data: result
    })
})


const getSpecificDonors = catchAsync(async(req:Request,res:Response) => {
     const id = req.params.id;
     const result =  await requestServices.getSpecificDonorDetails(id);

     sendResponse(res,{
        success:true,
        statusCode:200,
        message:"Donors Details fetched successfully ",
        data:result
     })
})




export const requestController = {
    retrieveDonors,
    requestBloodDonation,
    getBloodDonation,
    updateRequestStatus,
    getDonorRequests,
    getSpecificDonors
}
