import { Request, Response } from "express";
import catchAsync from "../../shared/catchAync";
import { userServices } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";


const createUser = catchAsync(async(req:Request,res:Response) => {
    const result = await userServices.createUserIntoDB(req.body);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User registered successfully",
        data:result
    })
})


const userLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.login(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: result
    })
})



export const userController = {
    createUser,
    userLogin
}