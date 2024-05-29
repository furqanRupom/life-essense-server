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


const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await userServices.getMyProfile(token as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result
    })
});


const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await userServices.updateProfile(token as string,req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data: result
    })
})



export const userController = {
    createUser,
    userLogin,
    getMyProfile,
    updateMyProfile
  
}