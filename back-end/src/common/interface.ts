
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
    data: Object[],
}

