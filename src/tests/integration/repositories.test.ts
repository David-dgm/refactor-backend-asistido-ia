import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {Order} from "../../domain/entities";
import mongoose from "mongoose";
import {OrderMongoRepository} from "../../infrastructure/repositories/orderMongoRepository";

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
