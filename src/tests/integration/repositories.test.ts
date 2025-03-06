import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";
import {Order} from "../../domain/entities";
import mongoose from "mongoose";
import {OrderMongoRepository} from "../../infrastructure/repositories/orderMongoRepository";

describe("The order Mongo Repository", ()=>{
    let repository: OrderMongoRepository;

    beforeAll(async ()=>{
        const dbUrl = "mongodb://127.0.0.1:27017/db_orders_mongo_repository";
        repository = await OrderMongoRepository.create(dbUrl);
        await mongoose.connection.dropDatabase();
    });

    afterEach(async ()=>{
        await mongoose.connection.dropDatabase();
    });

    it("saves and retrieve a given new valid order", async ()=>{
        //Arrange
        const order = await createValidOrder(repository);
        //Act
        await repository.save(order);
        //Assert
        const savedOrder = await repository.findById(order.getId());
        expect(savedOrder?.toDto()).toEqual(order.toDto());
    });

    it("finds all previously saved orders", async ()=>{
        //Arrange
        const order = await createValidOrder(repository);
        //Act
        const orders = await repository.findAll();
        //Assert
        expect(orders.length).toBe(1);
        expect(orders[0].toDto()).toEqual(order.toDto());
    });

    it("deletes a previously saved order", async ()=>{
        //Arrange
        const order = await createValidOrder(repository);
        //Act
        await repository.delete(order.getId());
        //Assert
        const orders = await repository.findAll();
        expect(orders.length).toBe(0);
    });

    it("updates a previously saved order", async ()=>{
        //Arrange
        const order = await createValidOrder(repository);
        //Act
        order.updateShippingAddress(Address.create("New Street 456"));
        await repository.save(order);
        //Assert
        const updatedOrder = await repository.findById(order.getId());
        expect(updatedOrder?.toDto()).toEqual(order.toDto());
    });
});

async function createValidOrder(repository: OrderMongoRepository) {
    const items = [
        new OrderLine(Id.create(), PositiveNumber.create(2), PositiveNumber.create(3)),
    ];
    const address = Address.create("Irrelevant Street 123");
    const order = Order.create(items, address);
    await repository.save(order);
    return order;
}
