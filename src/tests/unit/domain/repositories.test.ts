import { Order } from "../../../domain/entities";
import {OrderRepository} from "../../../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObjects";

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

    it('finds all previously saved orders', async () => {
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create("Irrelevant Street 123");
        const order = Order.create(items, address);
        const repository = new InMemoryOrderRepository();

        await repository.save(order);

        const orders = await repository.findAll();
        expect(orders.length).toBe(1);
        expect(orders[0].toDto()).toEqual(order.toDto());
    });

    it('deletes a previously saved order', async () => {
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create("Irrelevant Street 123");
        const order = Order.create(items, address);
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        await repository.delete(order.getId());

        const orders = await repository.findAll();
        expect(orders.length).toBe(0);
    });
});
