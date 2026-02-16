import dotenv from 'dotenv';

dotenv.config({path: "./config/.env"});

export const env = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    MOOD : process.env.MOOD,
    SALT : process.env.SALT,
    JWT_KEY: process.env.JWT_KEY
}
