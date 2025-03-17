import jwt from "jsonwebtoken"
import { config } from "../config"

export const generateToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

