

import { User } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt"
import { UserData } from "./user.interface";

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



export const userServices = {
  createUserIntoDB
}