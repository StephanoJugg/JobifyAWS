import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const errorMiddleware = (err: any, req: Request, res: Response) => {
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, try again later",
    }

    if(err.name === "ValidationError"){
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.message = Object.values(err.errors).map((val: any) => val.message).join(",");
    }

    if(err.code && err.code === 11000){
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`;
    }
    
    return res.status(defaultError.statusCode).json({msg: defaultError.message})
};

export default errorMiddleware;