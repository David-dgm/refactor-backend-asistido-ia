import {Order} from "./entities";
import {Id} from "./valueObjects";

export interface OrderRepository {
    findAll(): Promise<Order[]>;
    findById(id: Id): Promise<Order | undefined>;
    save(order: Order): Promise<void>;
    delete(id: Id): Promise<void>;
}

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Order[] = [];

    async findAll(): Promise<Order[]> {
        return this.orders;
    }

    async findById(id: Id): Promise<Order | undefined> {
        return this.orders.find(order => order.getId().equals(id));
    }

    async save(order: Order): Promise<void> {
        this.orders.push(order);
    }

    async delete(id: Id): Promise<void> {
        this.orders = this.orders.filter(order => !order.getId().equals(id));
    }
}
