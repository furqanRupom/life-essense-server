import { BloodGroup, Role } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "./app/shared/prisma";
import httpStatus from "http-status";
import AppError from "./app/errors/AppError";
import bcrypt from "bcrypt"

export const createAdmin = async () => {
    const adminData = {
        name: "essence admin",
        email: "admin@123.com",
        password: "admin123",
        role: Role.ADMIN,
        phoneNumber: "2390232",
        location: "essence city",
        bloodType: BloodGroup.AB_POSITIVE
    }
    const admin = await prisma.user.findUnique({
        where: {
            email: adminData.email
        }
    })

  



    if (admin) {
        throw new AppError(httpStatus.FOUND, "admin already exit")
    }

    const hashPassword = await bcrypt.hash(adminData.password, 12);

    const createAdmin = await prisma.user.create({
        data: { ...adminData, password: hashPassword }
    });
    await prisma.userProfile.create({
        data:{
            userId:createAdmin.id
        }
    })

    return {
        status: httpStatus.CREATED,
        message: "Admin created successfully",
        data: createAdmin
    }

}

createAdmin();