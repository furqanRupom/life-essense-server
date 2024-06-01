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
    next();
}, validateRequest(userValidation.userSchemaValidation), userController.createUser);
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    next();
}, userController.userLogin);


/* donor routes */

router.get('/donor-list',requestController.retrieveDonors);

router.post('/donation-request', validateRequest(requestValidation.requestSchemaValidation), requestController.requestBloodDonation);
router.get('/donor-request',requestController.getDonorRequests);
router.get('/donation-request', requestController.getBloodDonation);
router.get('/donor-details/:id',requestController.getSpecificDonors)
router.put('/donation-request/:requestId',(req,res,next) => {
       console.log(req.body)
       next();
}, requestController.updateRequestStatus);

router.get('/my-profile',userController.getMyProfile);
router.put('/my-profile', userController.updateMyProfile);




export const userRoutes = router;