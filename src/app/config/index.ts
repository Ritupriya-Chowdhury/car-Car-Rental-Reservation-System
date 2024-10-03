import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    default_password: process.env.DEFAULT_PASS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    email: process.env.EMAIL,
    email_password: process.env.EMAIL_PASSWORD,
    reset_password_link: process.env.RESET_PASS_UI_LINK, 
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, 
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET, 
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN, 
};
