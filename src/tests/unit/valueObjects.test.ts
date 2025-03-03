import {Address, Id, OrderLine, PositiveNumber} from "../../domain/valueObjects";

describe("A positive number", () => {
    it("allows positive values", ()=>{
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it("does not allow negative values", ()=>{
        expect(() => PositiveNumber.create(-1)).toThrowError("Negative numbers are not allowed");
    });

    it("multiplies two positive numbers", ()=>{
        const aPositiveNumber = PositiveNumber.create(2);
        const anotherPositiveNumber = PositiveNumber.create(3);

        const result = aPositiveNumber.multiply(anotherPositiveNumber);

        expect(result.value).toBe(6);
    });
});

describe("An address", () => {
    it("allows valid addresses", ()=>{
        const anAddress = Address.create("Irrelevant Street 123");
        expect(anAddress.value).toBe("Irrelevant Street 123");
    });

    it("does not allow empty addresses", ()=>{
        expect(() => Address.create("")).toThrowError("Address cannot be empty");
        expect(() => Address.create("     ")).toThrowError("Address cannot be empty");
    });
});

describe("An id", () => {
    it("creates a unique id", ()=>{
        const id1 = Id.create();
        const id2 = Id.create();

        expect(id1.value).not.toBe(id2.value);
    });
});

describe("An order line", () => {
    it('calculates subtotal', () => {
        const productId = Id.create();
        const quantity = PositiveNumber.create(2);
        const price = PositiveNumber.create(3);

        const orderLine = new OrderLine(productId, quantity, price);

        const total = orderLine.calculateSubtotal();

        expect(total.value).toBe(6);
    });
});
