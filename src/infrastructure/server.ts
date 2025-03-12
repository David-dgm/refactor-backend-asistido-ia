import express, {Request, RequestHandler, Response} from 'express';
import mongoose from 'mongoose';
import {completeOrder, createOrder, deleteOrder, getAllOrders, updateOrder} from './controllers/orderController';
import {Factory} from "../factory";

export async function createServer(port: number) {
    const orderUseCase = await Factory.createOrderUseCase();

    const app = express();
    app.use(express.json());

    app.post('/orders', ((req: Request, res: Response) => createOrder(orderUseCase, req, res)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => getAllOrders(orderUseCase, req, res)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) =>  updateOrder(orderUseCase, req, res)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) =>  completeOrder(orderUseCase, req, res)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => deleteOrder(orderUseCase, req, res)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {res.send({status: 'ok'});}) as RequestHandler);

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
