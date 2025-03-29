import jwt from "jsonwebtoken"
import { config } from "../config.js"

// Make sure your config.jwt.secret is properly typed as string
export const generateToken = (id: number, role: string) => {
  if (!config.jwt.secret) {
    throw new Error("JWT secret is not defined")
  }

  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || "30d",
  })
}

