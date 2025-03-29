import type { Request, Response, NextFunction } from "express"

export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg)
  }

  static notFound(msg: string) {
    return new ApiError(404, msg)
  }

  static forbidden(msg: string) {
    return new ApiError(403, msg)
  }

  static unauthorized(msg: string) {
    return new ApiError(401, msg)
  }

  static internal(msg: string) {
    return new ApiError(500, msg)
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)

  // If it's an ApiError, use its status code and message
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
  }

  // For other errors, use a generic 500 error
  return res.status(500).json({
    message: "Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
}

