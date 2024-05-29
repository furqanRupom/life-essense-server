

import { RequestStatus, User, UserProfile } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt"
import { UserData } from "./user.interface";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { config } from "../../config";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

/* create user  */

const createUserIntoDB = async (payload: UserData) => {
  const result = await prisma.$transaction(async (tx) => {
    const hashedPassword = await bcrypt.hash(payload.password, 12)
    const user: User = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        bloodType: payload.bloodType,
        location: payload.location
      }

    })

    await tx.userProfile.create({
      data: {
        userId: user.id,
      }
    })

    const getUser = await tx.user.findUniqueOrThrow({
      where: {
        id: user.id
      },
      include: {
        profile: true,
      }
    })
    const { password, ...withoutPassData } = getUser;
    return withoutPassData;
  })

  return result;
}


/* users logged in  */

const login = async (payload: { email: string, password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email
    }
  })
  const isMatch = await bcrypt.compare(payload.password, userData.password);

  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  const { name, email,role } = userData
  const accessToken = jwtHelpers.generateToken({ name, email,role }, config.secret_access_token as string, config.access_token_expires_in as string);

  const refreshToken  = jwtHelpers.generateToken({name,email,role},
    config.refresh_token as string, config.refresh_token_exp as string
  )

  return {
    accessToken: accessToken,
    refreshToken:refreshToken
  }
}



const getMyProfile = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'token is not found');
  }
  const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);
  if (!validtoken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'unauthorized error');
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: validtoken.email
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
      profile: true
    }
  })

  return user;


}

const updateProfile = async (token: string, payload: Partial<UserProfile>) => {

  console.log(payload);
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, 'token is not found');
  }
  const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);
  if (!validtoken) {
    throw new AppError(httpStatus.UNAUTHORIZED, ' unauthorized error');
  }

  const getMyProfile = await prisma.user.findUniqueOrThrow({
    where: {
      email: validtoken.email
    },
    include:{
      profile:true
    }
  })

  if (!getMyProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'user profile not found');
  }

  const updateProfile = await prisma.userProfile.update({
    where: {
      id: getMyProfile.profile?.id
    },
    data: payload
  })

  return updateProfile;
}


export const userServices = {
  createUserIntoDB,
  login,
  getMyProfile,
  updateProfile
}