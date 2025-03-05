import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {Order} from "../../domain/entities";
import {OrderRepository} from "../../domain/repositories";
import {OrderModel} from "../../models/orderModel";
import {OrderStatus} from "../../domain/models";
import mongoose from "mongoose";

class OrderMongoRepository implements OrderRepository {
    findAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }

    async findById(id: Id): Promise<Order | undefined> {
        const mongoOrder = await OrderModel.findById(id.value);
        if(!mongoOrder) {
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

describe("The order Mongo Repository", ()=>{
    beforeAll(async ()=>{
        const dbUrl = "mongodb://127.0.0.1:27017/db_orders_mongo_repository";
        await mongoose.connect(dbUrl);
        await mongoose.connection.dropDatabase()
    });

    it("saves and retrieve a given new valid order", async ()=>{
        //Arrange
        const items = [
            new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
        ];
        const address = Address.create("Irrelevant Street 123");
        const order = Order.create(items, address);
        const repository = new OrderMongoRepository();
        //Act
        await repository.save(order);
        //Assert
        const savedOrder = await repository.findById(order.id);
        expect(savedOrder?.toDto()).toEqual(order.toDto());
    });
});
