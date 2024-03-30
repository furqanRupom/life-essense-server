export const paginationHelpers = (options: {
    page?: string,
    limit?: string,
    sortOrder?: string,
    sortBy?: string
}) => {

    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip: number = (page - 1) * limit
    const sortBy: string = options.sortBy || 'cretedAt';
    const sortOrder: string = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }


}