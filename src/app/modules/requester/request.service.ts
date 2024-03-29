import prisma from "../../shared/prisma";


const retrieveAllDonors = async () => {
    const result = await prisma.user.findMany();
    return result;
}


export const  requestServices = {
    retrieveAllDonors
}