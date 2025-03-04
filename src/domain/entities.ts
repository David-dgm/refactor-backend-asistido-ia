import {Address, Id, OrderLine} from "./valueObjects";
import {DiscountCode, OrderStatus} from "./models";

export class Order{
    private constructor(
        readonly id:Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        readonly status: OrderStatus,
        readonly discountCode?: DiscountCode,
    ) {}

    static create(
        items: OrderLine[],
        shippingAddress: Address,
        discountCode?: DiscountCode,
    ): Order {
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }
}

