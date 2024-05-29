"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const request_controller_1 = require("../requester/request.controller");
const request_validation_1 = require("../requester/request.validation");
const router = express_1.default.Router();
router.post('/register', (req, res, next) => {
    next();
}, (0, validateRequest_1.default)(user_validation_1.userValidation.userSchemaValidation), user_controller_1.userController.createUser);
router.post('/login', (req, res, next) => {
    next();
}, user_controller_1.userController.userLogin);
/* donor routes */
router.get('/donor-list', request_controller_1.requestController.retrieveDonors);
router.post('/donation-request', (0, validateRequest_1.default)(request_validation_1.requestValidation.requestSchemaValidation), request_controller_1.requestController.requestBloodDonation);
router.get('/donor-request', request_controller_1.requestController.getDonorRequests);
router.get('/donation-request', request_controller_1.requestController.getBloodDonation);
router.put('/donation-request/:requestId', request_controller_1.requestController.updateRequestStatus);
router.get('/my-profile', user_controller_1.userController.getMyProfile);
router.put('/my-profile', user_controller_1.userController.updateMyProfile);
exports.userRoutes = router;
