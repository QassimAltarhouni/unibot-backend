import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY || '';
const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY || '';
const FORGET_PASSWORD_TOKEN_PRIVATE_KEY = process.env.FORGET_PASSWORD_TOKEN_PRIVATE_KEY || '';

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_HOST = process.env.MONGO_HOST || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SERVER_PORT) : 587;
const SMTP_SECURE = process.env.SMTP_SECURE ? Boolean(process.env.SMTP_SECURE) : true;

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export default {
    mongo: {
        // username: MONGO_USERNAME,
        // password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    jwt: {
        accessTokenPrivateKey: ACCESS_TOKEN_PRIVATE_KEY,
        refreshTokenPrivateKey: REFRESH_TOKEN_PRIVATE_KEY,
        forgetTokenPrivateKey: FORGET_PASSWORD_TOKEN_PRIVATE_KEY,
    },
    logLevel: LOG_LEVEL,
    smtp: {
        user: SMTP_USER,
        pass: SMTP_PASS,
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
    }
};
