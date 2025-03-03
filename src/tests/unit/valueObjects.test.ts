import {Address, PositiveNumber} from "../../domain/valueObjects";

describe("A positive number", () => {
    it("allows positive values", ()=>{
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it("does not allow negative values", ()=>{
        expect(() => PositiveNumber.create(-1)).toThrowError("Negative numbers are not allowed");
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
