

import { User } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt"
import { UserData } from "./user.interface";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { config } from "../../config";

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
        age: payload.age,
        bio: payload.bio,
        lastDonationDate: payload.lastDonationDate,

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

  const { name, email } = userData
  const accessToken = jwtHelpers.generateToken({ name, email }, config.secret_access_token as string, config.access_token_expires_in as string);

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken: accessToken
  }
}



export const userServices = {
  createUserIntoDB,
  login
}