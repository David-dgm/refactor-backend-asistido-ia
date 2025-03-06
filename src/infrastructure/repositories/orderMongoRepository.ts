import {OrderRepository} from "../../domain/repositories";
import {Order} from "../../domain/entities";
import {Id} from "../../domain/valueObjects";
import {MongooseOrder, OrderSchema} from "./orderModel";
import {OrderStatus} from "../../domain/models";
import mongoose, {Model, Mongoose, Schema} from "mongoose";

export class OrderMongoRepository implements OrderRepository {
    constructor(private mongoClient: Mongoose) {}

    static async create(dbUrl: string) {
        const client = await mongoose.connect(dbUrl);
        return new OrderMongoRepository(client);
    }

    async findAll(): Promise<Order[]> {
        const MongooseOrderModel = this.mongooseModel();
        const mongoOrder = await MongooseOrderModel.find();
        return mongoOrder.map(this.toOrderEntity);
    }

    private toOrderEntity = (order: MongooseOrder) => Order.fromDto({
        id: order._id,
        items: order.items,
        discountCode: order.discountCode,
        shippingAddress: order.shippingAddress,
        status: order.status as OrderStatus
    });

    async findById(id: Id): Promise<Order | undefined> {
        const MongooseOrderModel = this.mongooseModel();
        const mongoOrder = await MongooseOrderModel.findById(id.value);
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
        await this.mongooseModel().findByIdAndUpdate({_id: dto.id}, {
            items: dto.items,
            discountCode: dto.discountCode,
            shippingAddress: dto.shippingAddress,
            status: dto.status,
        }, {upsert: true});
    }

    private mongooseModel() {
        const modelName = 'Order';
        if(this.mongoClient.models[modelName]) {
            return this.mongoClient.models[modelName] as Model<MongooseOrder>;
        }
        return this.mongoClient.model<MongooseOrder>(modelName, this.mongooseSchema());
    }

    private mongooseSchema() {
        return new Schema({
            _id: {type: String, default: () => new mongoose.Types.ObjectId().toString()},
            items: [
                {
                    productId: {type: String},
                    quantity: {type: Number},
                    price: {type: Number},
                },
            ],
            status: {type: String, default: OrderStatus.Created},
            discountCode: {type: String, required: false},
            shippingAddress: {type: String},
            total: {type: Number, default: 0},
        });
    }

    async delete(id: Id): Promise<void> {
        await this.mongooseModel().deleteOne({_id: id.value});
    }


}
