import dotenv from 'dotenv';

dotenv.config({path: "./config/.env"});

export const env = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    MOOD : process.env.MOOD,
    SALT : process.env.SALT,
    JWT_KEY: process.env.JWT_KEY,
    USER_SIGNATURE: process.env.JWT_USER_SIGNATURE,
    ADMIN_SIGNATURE: process.env.JWT_ADMIN_SIGNATURE,
    ADMIIN_REFRESH_TOKEN: process.env.JWT_ADMIN_REFRESH_SIGNATURE,
    USER_REFRESH_TOKEN: process.env.JWT_USER_REFRESH_SIGNATURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    BASE_URL: process.env.BASE_URL,
    REDIS_URI: process.env.REDIS_URL,
    MONGO_URI_PROD: process.env.MONGO_URI_PROD
}
