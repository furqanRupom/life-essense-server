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
exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("./app/shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("./app/errors/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = {
        name: "essence admin",
        email: "admin@123.com",
        password: "admin123",
        role: client_1.Role.ADMIN,
        phoneNumber: "2390232",
        location: "essence city",
        bloodType: client_1.BloodGroup.AB_POSITIVE
    };
    const admin = yield prisma_1.default.user.findUnique({
        where: {
            email: adminData.email
        }
    });
    if (admin) {
        throw new AppError_1.default(http_status_1.default.FOUND, "admin already exit");
    }
    const hashPassword = yield bcrypt_1.default.hash(adminData.password, 12);
    const createAdmin = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, adminData), { password: hashPassword })
    });
    yield prisma_1.default.userProfile.create({
        data: {
            userId: createAdmin.id
        }
    });
    return {
        status: http_status_1.default.CREATED,
        message: "Admin created successfully",
        data: createAdmin
    };
});
exports.createAdmin = createAdmin;
(0, exports.createAdmin)();
