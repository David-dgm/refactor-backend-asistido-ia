import dotenv from "dotenv";
import {createServer} from "./app";

export const DB_URL = process.env.DB_URL
export const PORT = process.env.port

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

if (!DB_URL || !PORT) {
    console.error('Missing environment variables');
    process.exit(1);
}

createServer(PORT, DB_URL);
