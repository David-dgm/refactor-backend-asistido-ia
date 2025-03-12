import dotenv from "dotenv";
import { OrderRepository } from "./domain/repositories";
import {OrderMongoRepository} from "./infrastructure/repositories/orderMongoRepository";
import {OrderUseCase} from "./application/orderUseCase";

export class Factory{
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(){
        if(!this.OrderRepository){
            const DB_URL = process.env.MONGODB_URI as string;
            this.OrderRepository = await OrderMongoRepository.create(DB_URL);
        }
        return this.OrderRepository;
    }

    static async createOrderUseCase(){
        const repo = await this.getOrderRepository();
        return new OrderUseCase(repo);
    }
}
