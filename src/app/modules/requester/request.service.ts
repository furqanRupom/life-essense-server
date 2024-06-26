import { Prisma, RequestStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import { userSearchAbleFields } from "./request.constant";
import { Request, Response } from "express";
import { IDonation } from "./request.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { config } from "../../config";
import { IPaginationOptions } from "../../interface/interface";
import { paginationHelper } from "../../helpers/paginationHelpers";


const retrieveAllDonors = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);


    const { searchTerm, availability, ...filterData } = params;
    const andCondions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {

        andCondions.push({
            OR: userSearchAbleFields?.map(field => ({
                [field]: {
                    contains: params?.searchTerm,
                    mode: 'insensitive',

                }
            }))
        })
    };

    if (availability) {
        const value = availability == 'true' ? true : false
        console.log(value)
        andCondions.push({
            AND: {
                availability: {
                    equals: value
                }
            }
        })

    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData)?.map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })


    };





    const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

    const result = await prisma.user.findMany({
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
            image:true,
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


    const total = await prisma.user.count({
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
};



const requestBloodDonation = async (payload: IDonation, token: string) => {
    console.log(payload);
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, 'token is not found !');
    }

    const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);


    if (!validtoken) {
        throw new AppError(httpStatus.UNAUTHORIZED, ' unauthorized error');
    }

    const requestUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    })


    await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.donorId
        }
    })

    const updateAvailablity = await prisma.user.update({
        where: {
            email: validtoken.email
        },
        data: {
            availability: true
        }
    })

    if (!updateAvailablity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'cannont update availablity')
    }





    const result = await prisma.request.create({
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
    })

    return result;
}


const getBloodDonations = async (token: string) => {
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, 'token is not found ');
    }

    const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);

    if (!validtoken) {
        throw new AppError(httpStatus.UNAUTHORIZED, ' unauthorized error');
    }

    const requestUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    })
    const requestes = await prisma.request.findMany({
        where: {
            requesterId: requestUser.id,
        },
        include: {
            donor: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                    bloodType:true,
                    location: true,
                    emergencyPhoneNumber: true,
                    
                    phoneNumber: true,
                    availability: true,
                    socialMediaMethods: true,
                    profile: true,
                },

            },

        }

    })

    if (requestes.length < 0) {
        throw new AppError(httpStatus.NOT_FOUND, 'no request found')
    }

    return requestes;

}


const getDonorRequests = async (token: string) => {
    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, 'token is not found ');
    }

    const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);

    if (!validtoken) {
        throw new AppError(httpStatus.UNAUTHORIZED, ' unauthorized error');
    }

    const donorUser = await prisma.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    })
    const requestes = await prisma.request.findMany({
        where: {
            donorId: donorUser.id,
        },
        include: {
            requester: {
                select: {
                    id:true,
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

    })

    if (requestes.length < 0) {
        throw new AppError(httpStatus.NOT_FOUND, 'no request found')
    }

    return requestes;

}




const updateRequestStatus = async (payload: RequestStatus, token: string, requestId: any) => {

    if (!token) {
        throw new AppError(httpStatus.NOT_FOUND, 'token is not found');
    }
    const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);
    if (!validtoken) {
        throw new AppError(httpStatus.UNAUTHORIZED, ' unauthorized error');
    }
    const { requestStatus }: any = payload;
    console.log(payload);
    await prisma.user.findUniqueOrThrow({
        where: {
            email: validtoken.email
        }
    })

    const findRequests = await prisma.request.findFirst({
        where: {
            requesterId: requestId
        }
    })

    if (!findRequests) {
        throw new AppError(httpStatus.NOT_FOUND, 'This donner have no rquestes for blood donation');
    }
    const updateStatus = await prisma.request.update({
        where: {
            id: findRequests.id,
        },
        data: {
            requestStatus: requestStatus
        }
    })

    return updateStatus;
}



const getSpecificDonorDetails = async (id: string,token:Partial<string>) => {
    const validtoken = jwtHelpers.verifyToken(token, config.secret_access_token as string);
   let result ;
   if(validtoken){
        result = await prisma.user.findFirst({
           where: {
               id
           },
           include: {
               doner: {
                   where: {
                       email: validtoken?.email
                   }
               },
               socialMediaMethods:true
           }
       });
   }else{
       result = await prisma.user.findFirst({
           where: {
               id
           },
           include: {
               doner: true
           }
       });
   }

   

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Donors not found")
    }

    return result;
}



export const requestServices = {
    retrieveAllDonors,
    requestBloodDonation,
    getBloodDonations,
    updateRequestStatus,
    getDonorRequests,
    getSpecificDonorDetails
}