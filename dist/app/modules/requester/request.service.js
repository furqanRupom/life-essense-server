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
exports.requestServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const request_constant_1 = require("./request.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = require("../../config");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const retrieveAllDonors = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.calculatePagination(options);
    const { searchTerm, availability } = params, filterData = __rest(params, ["searchTerm", "availability"]);
    const andCondions = [];
    if (searchTerm) {
        andCondions.push({
            OR: request_constant_1.userSearchAbleFields === null || request_constant_1.userSearchAbleFields === void 0 ? void 0 : request_constant_1.userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params === null || params === void 0 ? void 0 : params.searchTerm,
                    mode: 'insensitive',
                }
            }))
        });
    }
    ;
    if (availability) {
        const value = availability == 'true' ? true : false;
        console.log(value);
        andCondions.push({
            AND: {
                availability: {
                    equals: value
                }
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: (_a = Object.keys(filterData)) === null || _a === void 0 ? void 0 : _a.map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            profile: {
                [options.sortBy]: options.sortOrder
            }
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            bloodType: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            profile: {
                select: {
                    id: true,
                    userId: true,
                    bio: true,
                    age: true,
                    lastDonationDate: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const requestBloodDonation = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found !');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const requestUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    });
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.donorId
        }
    });
    const updateAvailablity = yield prisma_1.default.user.update({
        where: {
            email: validtoken.email
        },
        data: {
            availability: true
        }
    });
    if (!updateAvailablity) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'cannont update availablity');
    }
    const result = yield prisma_1.default.request.create({
        data: {
            donorId: payload.donorId,
            name: payload.name,
            email: payload.email,
            bloodType: payload.bloodType,
            requesterId: requestUser.id,
            phoneNumber: payload.phoneNumber,
            dateOfDonation: payload.dateOfDonation,
            timeOfDonation: payload.timeOfDonation,
            hospitalName: payload.hospitalName,
            hospitalAddress: payload.hospitalAddress,
            reason: payload.reason
        },
        select: {
            id: true,
            donorId: true,
            phoneNumber: true,
            dateOfDonation: true,
            hospitalName: true,
            hospitalAddress: true,
            reason: true,
            createdAt: true,
            updatedAt: true,
            donor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    location: true,
                    bloodType: true,
                    availability: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: true,
                }
            }
        }
    });
    return result;
});
const getBloodDonations = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found ');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const requestUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    });
    const requestes = yield prisma_1.default.request.findMany({
        where: {
            requesterId: requestUser.id,
        },
        include: {
            donor: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                    bloodType: true,
                    location: true,
                    emergencyPhoneNumber: true,
                    phoneNumber: true,
                    availability: true,
                    socialMediaMethods: true,
                    profile: true,
                },
            },
        }
    });
    if (requestes.length < 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'no request found');
    }
    return requestes;
});
const getDonorRequests = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found ');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const donorUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    });
    const requestes = yield prisma_1.default.request.findMany({
        where: {
            donorId: donorUser.id,
        },
        include: {
            requester: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    location: true,
                    bloodType: true,
                    availability: true,
                }
            },
        }
    });
    if (requestes.length < 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'no request found');
    }
    return requestes;
});
const updateRequestStatus = (payload, token, requestId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.secret_access_token);
    if (!validtoken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, ' unauthorized error');
    }
    const { requestStatus } = payload;
    console.log(payload);
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    });
    const findRequests = yield prisma_1.default.request.findFirst({
        where: {
            requesterId: requestId
        }
    });
    if (!findRequests) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This donner have no rquestes for blood donation');
    }
    const updateStatus = yield prisma_1.default.request.update({
        where: {
            id: findRequests.id,
        },
        data: {
            requestStatus: requestStatus
        }
    });
    return updateStatus;
});
const getSpecificDonorDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: {
            id
        },
        include: {
            doner: true
        }
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Donors not found");
    }
    return result;
});
exports.requestServices = {
    retrieveAllDonors,
    requestBloodDonation,
    getBloodDonations,
    updateRequestStatus,
    getDonorRequests,
    getSpecificDonorDetails
};
