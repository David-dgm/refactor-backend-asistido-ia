import {Request, Response} from 'express';
import {DomainError} from "../../domain/error";
import {Factory} from "../../factory";
import {OrderUseCase} from "../../application/orderUseCase";

export const createOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const requestOrder = req.body;
        const result = await new OrderUseCase(repo).createOrder(requestOrder);
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
    const ordersDto = await new OrderUseCase(repo).getAllOrders();
    res.json(ordersDto);
};

export const updateOrder = async (req: Request, res: Response) => {
    const repo = await Factory.getOrderRepository();
    try {
        const requestOrderUpdate = {...req.body, id: req.params.id};
        res.send(await new OrderUseCase(repo).updateOrder(requestOrderUpdate));
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
        res.send(await new OrderUseCase(repo).completeOrder(id));
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
        let result = await new OrderUseCase(repo).deleteOrder(id);
        res.send(result);
    }catch (error){
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};
