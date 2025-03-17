import type { Request, Response, NextFunction } from "express"

interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }

  static notFound(message = "Resource not found") {
    return new ApiError(message, 404)
  }

  static badRequest(message = "Bad request") {
    return new ApiError(message, 400)
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(message, 401)
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(message, 403)
  }

  static internal(message = "Internal server error") {
    return new ApiError(message, 500)
  }
}

