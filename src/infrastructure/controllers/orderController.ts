import { Request, Response } from 'express';
import { OrderModel } from '../repositories/orderModel';
import {OrderStatus} from "../../domain/models";
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {Order} from "../../domain/entities";
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";

export const createOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const {items, discountCode, shippingAddress} = req.body;
        const orderLines = items.map((item) => (
            new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )
        ));
        const order = Order.create(orderLines, Address.create(shippingAddress), discountCode);
        await repo.save(order);
        res.send(`Order created with total: ${order.calculatesTotal().value}`);
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const getAllOrders = async (_req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    const orders = await repo.findAll();
    const ordersDto = orders.map(order => order.toDto());
    res.json(ordersDto);
};

// Update order
export const updateOrder = async (req: Request, res: Response) => {
    console.log("PUT /orders/:id");
    const { id } = req.params;
    const { status, shippingAddress, discountCode } = req.body;

    const order = await OrderModel.findById(id);
    if (!order) {
        return res.status(400).send('Order not found');
    }

    if (shippingAddress) {
        order.shippingAddress = shippingAddress;
    }

    if (status) {
        if (status === OrderStatus.Completed && order.items.length === 0) {
            return res.send('Cannot complete an order without items');
        }
        order.status = status;
    }

    if (discountCode) {
        order.discountCode = discountCode;
        if (discountCode === 'DISCOUNT20') {
            let newTotal = 0;
            for (const item of order.items) {
                newTotal += (item.price || 0) * (item.quantity || 0);
            }
            newTotal *= 0.8;
            order.total = newTotal;
        } else {
            console.log('Invalid or not implemented discount code');
        }
    }

    await order.save();
    res.send(`Order updated. New status: ${order.status}`);
};

export const completeOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const { id } = req.params;
        const order = await repo.findById(Id.from(id));
        if (!order) {
            throw new DomainError('Order not found to complete');
        }
        order.complete();
        await repo.save(order);
        res.send(`Order with id ${order.toDto().id} completed`);
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    try{
        const repo = await Factory.getOrderRepository();
        const { id } = req.params;
        const order = await repo.findById(Id.from(id));
        if (!order) {
            throw new DomainError('Order not found');
        }
        await repo.delete(order.getId());
        res.send('Order deleted');
    }catch (error){
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};
