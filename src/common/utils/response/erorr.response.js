import { env } from "../../../../config/index.js";

export const ErorrResponse = ({ status = 400, message = "SomeThing went wrong", extra = undefined } = {}) => {
    throw new Error(message, {cause: { status, extra }})

}

export const BadRequestException = ({ message = "Bad Request Exception", extra = undefined }) => {
    return ErorrResponse({
        status: 400,
        message,
        extra
    })
}

export const NotFoundException = ({ message = "Not Found Exception", extra = undefined } = {}) => {
    return ErorrResponse({
        status: 404,
        message,
        extra
    })
}

export const ConflictException = ({ message = "Conflict Exception", extra = undefined } = {}) => {
    return ErorrResponse({
        status: 409,
        message,
        extra
    })
}

export const UnAuthorizedException = ({ message = "UnAuthorized Exception", extra = undefined } = {}) => {
    return ErorrResponse({
        status: 401,
        message,
        extra
    })
}

export const globalErrorHandler = (error, req, res, next) => {
    const status = error.status ? error.status : error.cause.status ? error.cause.status : 500;
    const mood = env.MOOD == "dev" // ture or false
    const defaultMessage = 'Something went wrong';
    const displayMessage = error.message || defaultMessage;
    const extra = error.extra || {};
    res.status(status).json({
        status:status,
        stack: mood ? error.stack : null,
        erorrMessage: mood ? displayMessage : defaultMessage,
        extra: error.cause.extra
    })

}