import { ErrorResponse } from "$root/types/errorresponse.interface";
import AppError from "$root/utils/AppError.util";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const errorResponse: ErrorResponse = {
    status: "error",
    statusCode: statusCode,
    message: message,
    stack: err.stack,
  };

  res.status(statusCode).json(errorResponse);
};
