import {Order} from "../../domain/entities";
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {OrderStatus} from "../../domain/models";

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
        expect(order.id).toBeDefined();
        expect(order.items).toEqual(items);
        expect(order.shippingAddress).toEqual(shippingAddress);
        expect(order.discountCode).toBe(discountCode);
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
})
