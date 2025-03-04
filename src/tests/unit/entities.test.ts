import {Order} from "../../domain/entities";
import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";

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
        expect(order.items).toEqual(items);
        expect(order.shippingAddress).toEqual(shippingAddress);
        expect(order.discountCode).toBe(discountCode);
    })
})
