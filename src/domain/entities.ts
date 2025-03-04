import {Address, Id, OrderLine} from "./valueObjects";
import {DiscountCode, OrderStatus} from "./models";
import {DomainError} from "./error";

export class Order{
    private constructor(
        readonly id:Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        readonly status: OrderStatus,
        readonly discountCode?: DiscountCode,
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if (items.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }
}

