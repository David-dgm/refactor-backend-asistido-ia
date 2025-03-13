import {OrderUseCase, RequestOrder} from "../../../application/orderUseCase";
import {InMemoryOrderRepository} from "../../../domain/repositories";
import {OrderStatus} from "../../../domain/models";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObjects";
import {Order} from "../../../domain/entities";

describe("The Order Use Case", () => {
    it("creates an new order for a given order request", async ()=>{
        // Arrange
        const requestOrder: RequestOrder = {
            items: [
                { productId: "1", quantity: 2, price: 10 },
                { productId: "2", quantity: 1, price: 20 },
            ],
            shippingAddress: "123 Main St",
        };
        const repo = new InMemoryOrderRepository();
        const useCase = new OrderUseCase(repo);
        // Act
        const result = await useCase.createOrder(requestOrder);
        // Assert
        expect(result).toBe("Order created with total: 40");
        const orders = await repo.findAll();
        expect(orders.length).toBe(1);
    });

    it("creates a new order with a discount code", async ()=>{
        // Arrange
        const requestOrder: RequestOrder = {
            items: [
                { productId: "1", quantity: 2, price: 10 },
                { productId: "2", quantity: 1, price: 20 },
            ],
            discountCode: "DISCOUNT20",
            shippingAddress: "123 Main St",
        };
        const repo = new InMemoryOrderRepository();
        const useCase = new OrderUseCase(repo);
        // Act
        const result = await useCase.createOrder(requestOrder);
        // Assert
        expect(result).toBe("Order created with total: 32");
        const orders = await repo.findAll();
        expect(orders.length).toBe(1);
    });

    it("updates an order for a given order update request", async ()=>{
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        const useCase = new OrderUseCase(repository);
        const result = await useCase.updateOrder({
            id: order.getId().value,
            status: OrderStatus.Completed,
            shippingAddress: "New Address",
        });

        expect(result).toBe("Order updated. New status: COMPLETED");
        const updatedOrder = await repository.findById(order.getId());
        expect(updatedOrder?.toDto().status).toBe(OrderStatus.Completed);
        expect(updatedOrder?.toDto().shippingAddress).toBe("New Address");
    });

    it("gets all orders", async ()=>{
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        const useCase = new OrderUseCase(repository);
        const orders = await useCase.getAllOrders();

        expect(orders.length).toBe(1);
    });

    it("completes an order", async ()=>{
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);

        const useCase = new OrderUseCase(repository);
        const result = await useCase.completeOrder(order.getId().value);

        expect(result).toBe(`Order with id ${order.getId().value} completed`);
        const completedOrder = await repository.findById(order.getId());
        expect(completedOrder?.toDto().status).toBe(OrderStatus.Completed);
    });

    it("deletes an order", async ()=>{
        const order = createValidOrder();
        const repository = new InMemoryOrderRepository();
        await repository.save(order);
        const useCase = new OrderUseCase(repository);
        const ordersBeforeDelete = await repository.findAll();
        expect(ordersBeforeDelete.length).toBe(1);

        await useCase.deleteOrder(order.getId().value);

        const orders = await repository.findAll();
        expect(orders.length).toBe(0);
    });
});

function createValidOrder() {
    const items = [
        new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
    ];
    const address = Address.create("Irrelevant Street 123");
    return Order.create(items, address);
}
