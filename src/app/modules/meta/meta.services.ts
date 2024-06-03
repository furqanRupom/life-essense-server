import { Status } from "@prisma/client"
import prisma from "../../shared/prisma"

const adminMetaData = async () => {
    const totalAccounts = await prisma.user.count();
    const totalRequests = await prisma.request.count();
    const getActiveAccounts = await prisma.user.aggregate({
        where:{
            status:Status.ACTIVATE
        },
        _count:{
            status:true
        }
    })
    const totalActiveAccounts = getActiveAccounts._count.status;

    return {
        totalAccounts,
        totalRequests,
        totalActiveAccounts
    }
 
}

export const metaServices = {
    adminMetaData
}