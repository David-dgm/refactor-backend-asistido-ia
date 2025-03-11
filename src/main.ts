import dotenv from "dotenv";
import {createServer} from "./infrastructure/server";

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export const DB_URL = process.env.DB_URL
export const PORT = process.env.port

if (!DB_URL || !PORT) {
    console.error('Missing environment variables');
    process.exit(1);
}

createServer(Number(PORT), DB_URL);
