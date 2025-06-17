import request from 'supertest';
import { createServer } from '../../app';

import dotenv from 'dotenv';
import { Server } from "node:http";

dotenv.config( { path: '.env.test' } );

describe( 'Status endpoint', () => {
	let server: Server;
	beforeAll( () => {
		const dbUrl = process.env.DB_URL;
		const port = process.env.PORT;
		server = createServer( port as string, dbUrl as string );
	} )

	afterAll( () => {
		server.close();
	} )
	it( 'checks API health', async () => {
		const response = await request( server ).get( '/' );
		expect( response.status ).toBe( 200 );
		expect( response.body ).toEqual( { status: 'ok' } );
	} );
} );

