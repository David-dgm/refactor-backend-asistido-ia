import {OrderUseCase, RequestOrder} from "../../../application/orderUseCase";
import {InMemoryOrderRepository} from "../../../domain/repositories";

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
        const order = new OrderUseCase(repo);
        // Act
        const result = await order.createOrder(requestOrder);
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
        const order = new OrderUseCase(repo);
        // Act
        const result = await order.createOrder(requestOrder);
        // Assert
        expect(result).toBe("Order created with total: 32");
        const orders = await repo.findAll();
        expect(orders.length).toBe(1);
    });

    
});
