import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../index"
import { ApiError } from "./errorMiddleware"
import { config } from "../config"

interface JwtPayload {
  id: number
  role: string
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next(ApiError.unauthorized("Not authorized, no token"))
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

      // Get user from the token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, role: true },
      })

      if (!user) {
        return next(ApiError.unauthorized("Not authorized, user not found"))
      }

      req.user = {
        id: user.id,
        role: user.role,
      }

      next()
    } catch (error) {
      return next(ApiError.unauthorized("Not authorized, token failed"))
    }
  } catch (error) {
    next(error)
  }
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === "ADMIN" || req.user.role === "OWNER")) {
    next()
  } else {
    next(ApiError.forbidden("Not authorized as an admin"))
  }
}

export const owner = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "OWNER") {
    next()
  } else {
    next(ApiError.forbidden("Not authorized as an owner"))
  }
}

