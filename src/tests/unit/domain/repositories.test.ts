import {Order} from "../../../domain/entities";
import {InMemoryOrderRepository} from "../../../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObjects";

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
