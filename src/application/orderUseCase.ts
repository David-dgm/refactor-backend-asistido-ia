import {OrderRepository} from "../domain/repositories";
import {Address, Id, OrderLine, PositiveNumber} from "../domain/valueObjects";
import {Order} from "../domain/entities";
import {DomainError} from "../domain/error";
import {DiscountCode, OrderStatus} from "../domain/models";

type RequestOrder = {
    items: { productId: string; quantity: number; price: number }[];
    discountCode: DiscountCode;
    shippingAddress: string;
}

type RequestOrderUpdate = {
    id: string;
    status: OrderStatus;
    shippingAddress: string;
    discountCode: DiscountCode;
}

export class OrderUseCase {
    constructor(private repo: OrderRepository) {}

    async createOrder(requestOrder: RequestOrder) {
        const orderLines = requestOrder.items.map((item) => (
            new OrderLine(
                Id.from(item.productId),
                PositiveNumber.create(item.quantity),
                PositiveNumber.create(item.price)
            )
        ));
        const order = Order.create(orderLines, Address.create(requestOrder.shippingAddress), requestOrder.discountCode);
        await this.repo.save(order);
        return `Order created with total: ${order.calculatesTotal().value}`;
    }

    async updateOrder(requestOrderUpdate: RequestOrderUpdate) {
        const order = await this.repo.findById(Id.from(requestOrderUpdate.id)) as Order
        if (!order) {
            throw new DomainError('Order not found');
        }
        if (requestOrderUpdate.shippingAddress) {
            order.updateShippingAddress(Address.create(requestOrderUpdate.shippingAddress));
        }
        if (requestOrderUpdate.status) {
            order.updateStatus(requestOrderUpdate.status);
        }
        if (requestOrderUpdate.discountCode) {
            order.updateDiscountCode(requestOrderUpdate.discountCode);
        }
        await this.repo.save(order);
        return `Order updated. New status: ${order.toDto().status}`;
    }

    async getAllOrders() {
        const orders = await this.repo.findAll();
        return orders.map(order => order.toDto());
    }

    async completeOrder(id: string) {
        const order = await this.repo.findById(Id.from(id)) as Order;
        if (!order) {
            throw new DomainError('Order not found to complete');
        }
        order.complete();
        await this.repo.save(order);
        return `Order with id ${order.toDto().id} completed`;
    }

    async deleteOrder(id: string) {
        const order = await this.repo.findById(Id.from(id));
        if (!order) {
            throw new DomainError('Order not found');
        }
        await this.repo.delete(order.getId());
        return 'Order deleted';
    }
}
