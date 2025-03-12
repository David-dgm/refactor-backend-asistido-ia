import {Request, Response} from 'express';
import {DomainError} from "../../domain/error";
import {OrderUseCase} from "../../application/orderUseCase";


export const createOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    try {
        const requestOrder = req.body;
        const result = await orderUseCase.createOrder(requestOrder);
        res.send(result);
    } catch (error) {
        if (error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};

export const getAllOrders = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    const ordersDto = await orderUseCase.getAllOrders();
    res.json(ordersDto);
};

export const updateOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
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

export const completeOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
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

export const deleteOrder = async (orderUseCase: OrderUseCase, req: Request, res: Response) => {
    try{
        const { id } = req.params;
        let result = await orderUseCase.deleteOrder(id);
        res.send(result);
    }catch (error){
        if(error instanceof DomainError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Unexpected error");
    }
};
