import dotenv from "dotenv";
import { createServer } from "./app";

const DB_URL = process.env.MONGO_DB_URI;
const PORT = process.env.PORT;

dotenv.config( {
				   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
			   } );

if ( !DB_URL || !PORT ) {
	console.error( 'Missing environment variables' );
	process.exit( 1 );
}

createServer( PORT, DB_URL );