declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string
        JWT_SECRET: string
        PORT: string
        FRONTEND_URL: string
        NODE_ENV?: "development" | "production" | "test"
      }
    }
  }
  
  // Export an empty object to make this file a module
  export {}
  
  