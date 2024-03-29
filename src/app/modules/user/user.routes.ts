import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';
import { requestController } from '../requester/request.controller';


const router = express.Router();


router.post('/register', validateRequest(userValidation.userSchemaValidation), userController.createUser);
router.post('/login', userController.userLogin);


/* donor routes */

router.get('/donor-list', requestController.retrieveDonors);


export const userRoutes = router;