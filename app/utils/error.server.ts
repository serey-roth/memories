enum STATUS_CODES {
    NOT_FOUND = 404,
    FORBIDDEN = 403,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
}

export const createBadRequestError = (message: string) => {
    return new Response(message, {
        status: STATUS_CODES.BAD_REQUEST,
    });
}

export const createUnauthorizedError = (message: string) => {
    return new Response(message, { status: STATUS_CODES.UNAUTHORIZED });
}

export const createPostNotFoundError = (message: string) => {
    return new Response(message, {
        status: STATUS_CODES.NOT_FOUND,
    });
}

export const createForbiddenRequestError = (message: string) => {
    return new Response(message, {
        status: STATUS_CODES.FORBIDDEN
    });
}