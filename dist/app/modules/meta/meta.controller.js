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
exports.metaController = void 0;
const catchAync_1 = __importDefault(require("../../shared/catchAync"));
const meta_services_1 = require("./meta.services");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const getAdminMetaData = (0, catchAync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield meta_services_1.metaServices.adminMetaData();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Fetched admin meta data successfully ",
        data: result
    });
}));
exports.metaController = {
    getAdminMetaData
};
