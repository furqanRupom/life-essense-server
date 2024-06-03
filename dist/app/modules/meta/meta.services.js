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
exports.metaServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const adminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalAccounts = yield prisma_1.default.user.count();
    const totalRequests = yield prisma_1.default.request.count();
    const getActiveAccounts = yield prisma_1.default.user.aggregate({
        where: {
            status: client_1.Status.ACTIVATE
        },
        _count: {
            status: true
        }
    });
    const totalActiveAccounts = getActiveAccounts._count.status;
    return {
        totalAccounts,
        totalRequests,
        totalActiveAccounts
    };
});
exports.metaServices = {
    adminMetaData
};
