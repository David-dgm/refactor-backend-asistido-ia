import {Request, Response} from 'express';
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";

export const createOrder = async (req: Request, res: Response) => {
    const orderUseCase = await Factory.createOrderUseCase();
    try {
        const requestOrder = req.body;
        const result = await orderUseCase.createOrder(requestOrder);
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
    const orderUseCase = await Factory.createOrderUseCase();
    const ordersDto = await orderUseCase.getAllOrders();
    res.json(ordersDto);
};

export const updateOrder = async (req: Request, res: Response) => {
    const orderUseCase = await Factory.createOrderUseCase();
    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await orderUseCase.updateOrder(requestOrderUpdate));
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const completeOrder = async (req: Request, res: Response) => {
    const orderUseCase = await Factory.createOrderUseCase();
    try {
        const { id } = req.params;
        res.send(await orderUseCase.completeOrder(id));
    }
    catch (error) {
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    const orderUseCase = await Factory.createOrderUseCase();
    try{
        res.send(await orderUseCase.deleteOrder(req.params.id));
    }catch (error){
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};
