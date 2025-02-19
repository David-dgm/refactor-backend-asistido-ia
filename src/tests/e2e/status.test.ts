import request from 'supertest';
import { app } from '../../app';

describe('Status endpoint', () => {
    it('checks API health', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });


});
