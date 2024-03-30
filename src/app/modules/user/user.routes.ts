import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import { requestController } from '../requester/request.controller';
import { requestValidation } from '../requester/request.validation';


const router = express.Router();


router.post('/register', validateRequest(userValidation.userSchemaValidation), userController.createUser);
router.post('/login', userController.userLogin);


/* donor routes */

router.get('/donor-list',requestController.retrieveDonors);

router.post('/donation-request',validateRequest(requestValidation.requestSchemaValidation), requestController.requestBloodDonation);

router.get('/donation-request', requestController.getBloodDonation);

router.put('/donation-request/:requestId', requestController.updateRequestStatus);

router.get('/my-profile',requestController.getMyProfile);


export const userRoutes = router;