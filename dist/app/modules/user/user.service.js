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
exports.userServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = require("../../config");
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
                age: payload.age,
                bio: payload.bio,
                lastDonationDate: payload.lastDonationDate,
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
            email: payload.email
        }
    });
    const isMatch = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isMatch) {
        throw new Error("Password is incorrect");
    }
    const { name, email } = userData;
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ name, email }, config_1.config.secret_access_token, config_1.config.access_token_expires_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        accessToken: accessToken
    };
});
exports.userServices = {
    createUserIntoDB,
    login
};
