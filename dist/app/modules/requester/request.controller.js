"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAync_1 = __importDefault(require("../../shared/catchAync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const request_service_1 = require("./request.service");
const request_constant_1 = require("./request.constant");
const pick_1 = __importDefault(require("../../shared/pick"));
const retrieveDonors = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, request_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortOrder', 'sortBy']);
    const result = yield request_service_1.requestServices.retrieveAllDonors(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donors successfully found",
        meta: result.meta,
        data: result.data
    });
}));
const requestBloodDonation = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield request_service_1.requestServices.requestBloodDonation(req.body, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Request successfully made",
        data: result
    });
}));
const getBloodDonation = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield request_service_1.requestServices.getBloodDonations(token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation requests retrieved successfully",
        data: result
    });
}));
const updateRequestStatus = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const requestId = req.params.requestId;
    const result = yield request_service_1.requestServices.updateRequestStatus(req.body, token, requestId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Donation request status successfully updated",
        data: result
    });
}));
const getMyProfile = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield request_service_1.requestServices.getMyProfile(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Profile retrieved successfully",
        data: result
    });
}));
exports.requestController = {
    retrieveDonors,
    requestBloodDonation,
    getBloodDonation,
    updateRequestStatus,
    getMyProfile
};
