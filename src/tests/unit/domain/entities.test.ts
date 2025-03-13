import {Order} from "../../../domain/entities";
import {Address, Id, OrderLine, PositiveNumber} from "../../../domain/valueObjects";
import {OrderStatus} from "../../../domain/models";

describe("The order", ()=>{
    it("creates an order with the given fields are valid", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
            new OrderLine(Id.create(), PositiveNumber.create(1), PositiveNumber.create(2)),
        ];
        const discountCode = "DISCOUNT20";
        const shippingAddress = Address.create("Irrelevant Street 123");

        const order = Order.create(items, shippingAddress, discountCode);

        expect(order).toBeDefined();
        expect(order.toDto().id).toBeDefined();
        expect(order.items).toEqual(items);
        expect(order.toDto().shippingAddress).toEqual(shippingAddress.value);
        expect(order.toDto().discountCode).toBe(discountCode);
    });

    it("does not allow to create an order when no items are provided", ()=>{
        const items:OrderLine[] = [];
        const shippingAddress = Address.create("Irrelevant Street 123");

        expect(() => Order.create(items, shippingAddress)).toThrow("The order must have at least one item");
    });

    it("calculates the total price of a given order with a single line", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        expect(order.calculatesTotal()).toEqual(PositiveNumber.create(6));
    });

    it("calculates the total price of a given order with multiple lines", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
            new OrderLine(Id.create(), PositiveNumber.create(1), PositiveNumber.create(2)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        expect(order.calculatesTotal()).toEqual(PositiveNumber.create(8));
    });

    it("calculates the total price of a given order with a discount code", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
            new OrderLine(Id.create(), PositiveNumber.create(1), PositiveNumber.create(2)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress, "DISCOUNT20");

        expect(order.calculatesTotal()).toEqual(PositiveNumber.create(8));
    });

    it("completes a given order with created status", ()=>{
       const items = [
              new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
       ];
       const shippingAddress = Address.create("Irrelevant Street 123");
       const order = Order.create(items, shippingAddress);

       order.complete();

       expect(order.isCompleted()).toBe(true);
    });

    it("does not allow to complete an order with no created status", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        order.complete();

        expect(() => order.complete()).toThrow(`Cannot complete an order with status: ${OrderStatus.Completed}`);
    });

    it("transforms an order to a DTO", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress, "DISCOUNT20");

        const dto = order.toDto();

        expect(dto.id).toBe(order.toDto().id);
        expect(dto.items).toEqual(items.map(item => ({
            productId: item.productId.value,
            quantity: item.quantity.value,
            price: item.price.value,
        })));
        expect(dto.shippingAddress).toBe(shippingAddress.value);
        expect(dto.status).toBe(OrderStatus.Created);
        expect(dto.discountCode).toBe("DISCOUNT20");
    });

    it("creates an order from a DTO", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress, "DISCOUNT20");

        const dto = order.toDto();
        const newOrder = Order.fromDto(dto);

        expect(newOrder.toDto().id).toBe(dto.id);
        expect(newOrder.items.map((item: OrderLine) => item.productId.value)).toEqual(dto.items.map(item => item.productId));
        expect(newOrder.items.map((item: OrderLine) => item.quantity.value)).toEqual(dto.items.map(item => item.quantity));
        expect(newOrder.items.map((item: OrderLine) => item.price.value)).toEqual(dto.items.map(item => item.price));
        expect(newOrder.toDto().shippingAddress).toBe(dto.shippingAddress);
        expect(newOrder.toDto().discountCode).toBe(dto.discountCode);
    });

    it("updates the shipping address of a given order", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        const newAddress = Address.create("New Street 456");
        order.updateShippingAddress(newAddress);

        expect(order.toDto().shippingAddress).toEqual(newAddress.value);
    });

    it("updates the discount code of a given order", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        order.updateDiscountCode("DISCOUNT20");

        expect(order.toDto().discountCode).toBe("DISCOUNT20");
    });

    it("updates the status of a given order", ()=>{
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(4)),
        ];
        const shippingAddress = Address.create("Irrelevant Street 123");
        const order = Order.create(items, shippingAddress);

        order.updateStatus(OrderStatus.Completed);

        expect(order.toDto().status).toBe(OrderStatus.Completed);
    });
})
