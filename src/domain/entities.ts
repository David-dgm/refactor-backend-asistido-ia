import {Address, Id, OrderLine, PositiveNumber} from "./valueObjects";
import {DiscountCode, OrderStatus} from "./models";
import {DomainError} from "./error";

type OrderDto = {
    discountCode: "DISCOUNT20" | undefined;
    shippingAddress: string;
    id: string;
    items: { quantity: number; productId: string; price: number }[];
    status: OrderStatus
};

export class Order{
    private constructor(
        private id:Id,
        readonly items: OrderLine[],
        private shippingAddress: Address,
        private status: OrderStatus,
        private discountCode?: DiscountCode,
    ) {}

    static create(items: OrderLine[], shippingAddress: Address, discountCode?: DiscountCode): Order {
        if (items.length === 0) {
            throw new DomainError("The order must have at least one item");
        }
        return new Order(Id.create(), items, shippingAddress, OrderStatus.Created, discountCode);
    }

    static fromDto(dto: OrderDto) {
        return new Order(
            Id.from(dto.id),
            dto.items.map(item => new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )),
            Address.create(dto.shippingAddress),
            dto.status,
            dto.discountCode
        );
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
        if(this.status !== OrderStatus.Created) {
            throw new DomainError(`Cannot complete an order with status: ${this.status}`);
        }
        this.status = OrderStatus.Completed;
    }

    isCompleted() {
        return this.status === OrderStatus.Completed;
    }

    toDto() {
        return {
            id: this.id.value,
            items: this.items.map(item => ({
                productId: item.productId.value,
                quantity: item.quantity.value,
                price: item.price.value,
            })),
            shippingAddress: this.shippingAddress.value,
            status: this.status,
            discountCode: this.discountCode,
        };
    }

    updateShippingAddress(newAddress: Address) {
        this.shippingAddress = newAddress;
    }

    updateDiscountCode(discount: DiscountCode) {
        this.discountCode = discount;
    }

    getId() {
        return this.id;
    }

    updateStatus(status: OrderStatus) {
        this.status = status;
    }
}

