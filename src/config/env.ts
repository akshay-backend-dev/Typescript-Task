import dotenv from "dotenv";
dotenv.config();

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  MONGO_URI: process.env.MONGO_URI as string,
  PORT: process.env.PORT || 2209,
};



// import { z } from "zod";
// import dotenv from "dotenv";

// dotenv.config();

// const envSchema = z.object({
//   MONGO_URI: z.string().min(1),
//   JWT_SECRET: z.string().min(1),
//   PORT: z.coerce.number().default(2209),
// });

// export const env = envSchema.parse(process.env);