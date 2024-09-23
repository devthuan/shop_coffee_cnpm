
export interface RespondInterfacePOST {
    statusCode: number,
    status: string,
    message: string,
    data: Object,
}

export interface RespondInterfaceGET {
    statusCode: number,
    status: string,
    message: string,
    data: Object,
}

export interface RespondInterfaceGETALL {
    statusCode: number,
    status: string,
    message: string,
    total: number,
    totalPages: number,
    currentPage: number,
    data: Object[],
}

