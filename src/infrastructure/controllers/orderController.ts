import {Request, Response} from 'express';
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {Order} from "../../domain/entities";
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";
import {OrderRepository} from "../../domain/repositories";

async function createOrderUseCase(requestOrder, repo: OrderRepository) {
    const orderLines = requestOrder.items.map((item) => (
        new OrderLine(
            Id.from(item.productId),
            PositiveNumber.create(item.quantity),
            PositiveNumber.create(item.price)
        )
    ));
    const order = Order.create(orderLines, Address.create(requestOrder.shippingAddress), requestOrder.discountCode);
    await repo.save(order);
    return `Order created with total: ${order.calculatesTotal().value}`;
}

async function getAllOrdersUseCase(repo: OrderRepository) {
    const orders = await repo.findAll();
    return orders.map(order => order.toDto());
}

export const createOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const requestOrder = req.body;
        const result = await createOrderUseCase(requestOrder, repo);
        res.send(result);
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    const ordersDto = await getAllOrdersUseCase(repo);
    res.json(ordersDto);
};

async function updateOrderUseCase(repo: OrderRepository, requestOrderUpdate) {
    const order = await repo.findById(Id.from(requestOrderUpdate.id)) as Order
    if (!order) {
        throw new DomainError('Order not found');
    }
    if (requestOrderUpdate.shippingAddress) {
        order.updateShippingAddress(Address.create(requestOrderUpdate.shippingAddress));
    }
    if (requestOrderUpdate.status) {
        order.updateStatus(requestOrderUpdate.status);
    }
    if (requestOrderUpdate.discountCode) {
        order.updateDiscountCode(requestOrderUpdate.discountCode);
    }
    await repo.save(order);
    return `Order updated. New status: ${order.toDto().status}`;
}

export const updateOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await updateOrderUseCase(repo, requestOrderUpdate));
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
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
        let result = 'Order deleted';
        res.send(result);
    }catch (error){
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};
