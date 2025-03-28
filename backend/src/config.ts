export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: "30d",
  },
  db: {
    url: process.env.DATABASE_URL || "mysql://user:password@localhost:3306/mydb",
  },
}

