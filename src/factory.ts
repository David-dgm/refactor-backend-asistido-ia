import dotenv from "dotenv";
import { OrderRepository } from "./domain/repositories";
import {OrderMongoRepository} from "./infrastructure/repositories/orderMongoRepository";

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

export class Factory{
    private static OrderRepository: OrderRepository;

    static async getOrderRepository(){
        if(!this.OrderRepository){
            const DB_URL = process.env.DB_URL as string;
            this.OrderRepository = await OrderMongoRepository.create(DB_URL);
        }
        return this.OrderRepository;
    }
}
