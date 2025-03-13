import { Order } from "../../../domain/entities";
import {OrderRepository} from "../../../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObjects";

export class InMemoryOrderRepository implements OrderRepository {
    private orders: Order[] = [];
    findAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    async findById(id: Id): Promise<Order | undefined> {
        return this.orders.find(order => order.getId().equals(id));
    }
    async save(order: Order): Promise<void> {
        this.orders.push(order);
    }
    delete(id: Id): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

describe('The Order Repository', () => {
    it('saves a given valid order', async () => {
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create("Irrelevant Street 123");
        const order = Order.create(items, address);
        const repository = new InMemoryOrderRepository();

        await repository.save(order);

        const savedOrder = await repository.findById(order.getId());
        expect(savedOrder?.toDto()).toEqual(order.toDto());
    });
});
