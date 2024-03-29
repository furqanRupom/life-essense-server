import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { userValidation } from './user.validation';


const router = express.Router();


router.post('/register', validateRequest(userValidation.userSchemaValidation), userController.createUser);
router.post('/login', userController.userLogin);


export const userRoutes = router;