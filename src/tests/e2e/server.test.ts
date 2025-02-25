import request from 'supertest';
import {createServer} from '../../server';
import dotenv from 'dotenv';
import {Server} from "http";
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test' });

describe('Status endpoint', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl = process.env.MONGODB_URI;
        const port = process.env.PORT;
        console.log('DB URL:', dbUrl);
        server = await createServer(Number(port), dbUrl as string);
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
        server.close();
    });

    it('creates a new order successfully', async () => {
        const response = await createValidOrder(server);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 100');
    });

    it('creates a new order with discount successfully', async () => {
        const response = await createValidOrder(server, 'DISCOUNT20');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Order created with total: 80');
    });

    it('does not allow to create an order when missing items', async () => {
        const order = {
            items: [],
            shippingAddress: "Irrelevant Street 123",
        };

        const response = await request(server)
            .post('/orders')
            .send(order);

        expect(response.status).toBe(400);
        expect(response.text).toBe('The order must have at least one item');
    });
});

describe('GET /orders', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl = process.env.MONGODB_URI as string;
        server = await createServer(3003, dbUrl);
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        server.close();
    });

    it('lists no orders when store is empty', async () => {
        const response = await request(server)
            .get('/orders');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('list one order after creating it', async () => {
        await createValidOrder(server);

        const response = await request(server)
            .get('/orders');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });
});

describe('DELETE /orders/:id', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl = process.env.MONGODB_URI as string;
        server = await createServer(3004, dbUrl);
    });

    afterAll(async () => {
        server.close();
    });

    it('deletes an order successfully', async () => {
        const order = await createValidOrder(server);

        const deleteResponse = await request(server)
            .delete(`/orders/${order._id}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.text).toBe('Order deleted');
    });

    it('does not allow to delete a non-existing order', async () => {
        const deleteResponse = await request(server)
            .delete(`/orders/123`);

        expect(deleteResponse.status).toBe(400);
        expect(deleteResponse.text).toBe('Order not found');
    });
})

describe('POST /orders/:id/complete', () => {
    let server: Server;

    beforeAll(async () => {
        const dbUrl = process.env.MONGODB_URI as string;
        server = await createServer(3005, dbUrl);
        await mongoose.connection.dropDatabase();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        server.close();
    });

    it('completes an order successfully', async () => {
        const order = await createValidOrder(server);

        const completeResponse = await request(server)
            .post(`/orders/${order._id}/complete`);

        expect(completeResponse.status).toBe(200);
        expect(completeResponse.text).toBe(`Order with id ${order._id} completed`);
    });

    it('does not allow to complete a non-existing order', async () => {
        const completeResponse = await request(server)
            .post(`/orders/123/complete`);

        expect(completeResponse.status).toBe(400);
        expect(completeResponse.text).toBe('Order not found to complete');
    });

    it('does not allow to complete an order with status different than CREATED', async () => {
        const order = await createValidOrder(server);
        await request(server)
            .post(`/orders/${order._id}/complete`);

        const completeResponse = await request(server)
            .post(`/orders/${order._id}/complete`);

        expect(completeResponse.status).toBe(400);
        expect(completeResponse.text).toBe(`Cannot complete an order with status: COMPLETED`);
    });
});

async function createValidOrder(server: Server, discountCode?: string) {
    const order = {
        items: [
            {
                productId: "1",
                quantity: 1,
                price: 100
            }
        ],
        shippingAddress: "Irrelevant Street 123",
        discountCode: discountCode
    };
    await request(server).post('/orders').send(order);
    const response = await request(server).get('/orders');
    return response.body[0];
}
