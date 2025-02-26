import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "";
const EMAIL_SECRET = process.env.EMAIL_SECRET || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

export default {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    REFRESH_SECRET,
    EMAIL_SECRET,
    SMTP_USER,
    SMTP_PASS
};