import dotenv from "dotenv";
dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || "your_default_secret_key",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
  // Add other configuration as needed
};

// Also add a default export for backward compatibility
export default config;