import {Address, Id, OrderLine, PositiveNumber} from "./valueObjects";
import {DiscountCode, OrderStatus} from "./models";
import {DomainError} from "./error";

export class Order{
    private constructor(
        readonly id:Id,
        readonly items: OrderLine[],
        readonly shippingAddress: Address,
        private status: OrderStatus,
        readonly discountCode?: DiscountCode,
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if (items.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }

    calculatesTotal() {
        const total = this.items.reduce((total, item) =>
            total.add(item.calculateSubtotal()), PositiveNumber.create(0));
        return this.applyDiscount(total);
    }

    private applyDiscount(total: PositiveNumber) {
        if (this.discountCode === 'DISCOUNT20') {
            return total.multiply(PositiveNumber.create(0.8));
        }
        return total;
    }

    complete() {
        this.status = OrderStatus.Completed;
    }

    isCompleted() {
        return this.status === OrderStatus.Completed;
    }
}

