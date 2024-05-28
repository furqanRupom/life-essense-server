import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import { requestController } from '../requester/request.controller';
import { requestValidation } from '../requester/request.validation';
import { userServices } from './user.service';
import sendResponse from '../../shared/sendResponse';
import prisma from '../../shared/prisma';


const router = express.Router();


router.post('/register',(req:Request,res:Response,next:NextFunction)=>{
   
    console.log(req.body)
    next();
}, validateRequest(userValidation.userSchemaValidation), userController.createUser);
router.post('/login', userController.userLogin);


/* donor routes */

router.get('/donor-list',requestController.retrieveDonors);

router.post('/donation-request',validateRequest(requestValidation.requestSchemaValidation), requestController.requestBloodDonation);

router.get('/donation-request', requestController.getBloodDonation);

router.put('/donation-request/:requestId', requestController.updateRequestStatus);

router.get('/my-profile',userController.getMyProfile);
router.put('/my-profile', userController.updateMyProfile);




export const userRoutes = router;