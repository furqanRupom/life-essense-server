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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = exports.updateSocialProfile = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = require("../../config");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
/* create user  */
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
        const user = yield tx.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashedPassword,
                bloodType: payload.bloodType,
                location: payload.location
            }
        });
        yield tx.userProfile.create({
            data: {
                userId: user.id,
            }
        });
        const getUser = yield tx.user.findUniqueOrThrow({
            where: {
                id: user.id
            },
            include: {
                profile: true,
            }
        });
        const { password } = getUser, withoutPassData = __rest(getUser, ["password"]);
        return withoutPassData;
    }));
    return result;
});
/* users logged in  */
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.Status.ACTIVATE
        }
    });
    const isMatch = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isMatch) {
        throw new Error("Password is incorrect");
    }
    const { name, email, role } = userData;
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ name, email, role }, config_1.config.secret_access_token, config_1.config.access_token_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ name, email, role }, config_1.config.refresh_token, config_1.config.refresh_token_exp);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
});
const getMyProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'unauthorized error');
    }
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        },
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            bloodType: true,
            phoneNumber: true,
            image: true,
            emergencyPhoneNumber: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
            socialMediaMethods: true
        }
    });
    return user;
});
const updateProfile = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const getMyProfile = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        },
        include: {
            profile: true
        }
    });
    if (!getMyProfile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user profile not found');
    }
    if (payload.age || payload.lastDonationDate) {
        yield prisma_1.default.userProfile.update({
            where: {
                id: (_a = getMyProfile === null || getMyProfile === void 0 ? void 0 : getMyProfile.profile) === null || _a === void 0 ? void 0 : _a.id
            },
            data: {
                age: payload.age,
                lastDonationDate: payload.lastDonationDate
            }
        });
    }
    const { age, lastDonationDate } = payload, profileData = __rest(payload, ["age", "lastDonationDate"]);
    const updateProfileData = yield prisma_1.default.user.update({
        where: {
            email: getMyProfile.email
        },
        data: profileData
    });
    if (!updateProfileData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong");
    }
    return updateProfileData;
});
const updateSocialProfile = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(token, payload);
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    });
    const isSocialMedia = yield prisma_1.default.socialMediaMethods.findUnique({
        where: {
            userId: user.id
        }
    });
    if (!isSocialMedia) {
        yield prisma_1.default.socialMediaMethods.create({
            data: Object.assign({ userId: user.id }, payload)
        });
    }
    else {
        yield prisma_1.default.socialMediaMethods.update({
            where: {
                userId: user.id
            },
            data: payload
        });
    }
    return null;
});
exports.updateSocialProfile = updateSocialProfile;
const changePassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken === null || validtoken === void 0 ? void 0 : validtoken.email
        }
    });
    const isMatched = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password did not matched !");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    const updatePassword = yield prisma_1.default.user.update({
        where: {
            id: userData.id
        },
        data: {
            password: hashedPassword
        }
    });
    return updatePassword;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        include: {
            socialMediaMethods: true,
            profile: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
});
const userManagement = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.role) {
        yield prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                role: payload.role
            }
        });
    }
    if (payload.status) {
        yield prisma_1.default.user.update({
            where: {
                id
            },
            data: {
                status: payload.status
            }
        });
    }
    return null;
});
exports.userServices = {
    createUserIntoDB,
    login,
    getMyProfile,
    updateProfile,
    updateSocialProfile: exports.updateSocialProfile,
    changePassword,
    getAllUsers,
    userManagement
};
