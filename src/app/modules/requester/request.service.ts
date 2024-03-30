import { Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interface/interface";
import prisma from "../../shared/prisma";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { userSearchableFields } from "./request.constant";


const retrieveAllDonors = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelpers(options);
    console.log(options)

    const { searchTerm, ...filterData } = params;
    console.log(params);
    const andCondions: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
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
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            profile: true
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


export const  requestServices = {
    retrieveAllDonors
}