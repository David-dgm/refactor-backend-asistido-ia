import {OrderRepository} from "../../domain/repositories";
import {Order} from "../../domain/entities";
import {Id} from "../../domain/valueObjects";
import {OrderModel} from "./orderModel";
import {OrderStatus} from "../../domain/models";

export class OrderMongoRepository implements OrderRepository {
    findAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }

    async findById(id: Id): Promise<Order | undefined> {
        const mongoOrder = await OrderModel.findById(id.value);
        if (!mongoOrder) {
            return undefined;
        }
        return Order.fromDto({
            id: mongoOrder._id,
            items: mongoOrder.items,
            discountCode: mongoOrder.discountCode,
            shippingAddress: mongoOrder.shippingAddress,
            status: mongoOrder.status as OrderStatus
        });
    }

    async save(order: Order): Promise<void> {
        const dto = order.toDto();
        const mongoOrder = new OrderModel({
            _id: dto.id,
            items: dto.items,
            discountCode: dto.discountCode,
            shippingAddress: dto.shippingAddress,
            status: dto.status,
        });
        await mongoOrder.save();
    }

    delete(id: Id): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
