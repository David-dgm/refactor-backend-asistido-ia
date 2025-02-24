import request from 'supertest';
import {createServer} from '../../server';
import dotenv from 'dotenv';
import {Server} from "http";
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test' });

xdescribe('Status endpoint', () => {
    let server: Server;

    beforeAll(() => {
        const dbUrl = process.env.DB_URL;
        const port = process.env.PORT;
        server = createServer(Number(port), dbUrl as string);
    });

    afterAll(() => {
        server.close();
    });

    it('checks API health', async () => {
        const response = await request(server).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});

describe('POST /orders', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl = process.env.MONGODB_URI as string;
        server = await createServer(3002, dbUrl);
    });

    afterAll(async () => {
        await server.close();
    });

    it('creates a new order successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: "Irrelevant Street 123",
        };
        const response = await request(server)
            .post('/orders')
            .send(order);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    });

    it('creates a new order with discount successfully', async () => {
        const order = {
            items: [
                {
                    productId: "1",
                    quantity: 1,
                    price: 100
                }
            ],
            shippingAddress: "Irrelevant Street 123",
            discountCode: 'DISCOUNT20'
        };
        const response = await request(server)
            .post('/orders')
            .send(order);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    });

})
