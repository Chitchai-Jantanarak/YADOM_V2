export const config = {
    isDevelopment: process.env.NODE_ENV !== "production",
    database: {
      url: process.env.DATABASE_URL,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: "30d",
    },
    server: {
      port: Number.parseInt(process.env.PORT || "5000", 10),
    },
    client: {
      url: process.env.FRONTEND_URL,
    },
  }
  
  