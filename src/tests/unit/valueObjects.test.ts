import {PositiveNumber} from "../../domain/valueObjects";

describe("A positive number", () => {
    it("allows positive values", ()=>{
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it("does not allow negative values", ()=>{
        expect(() => PositiveNumber.create(-1)).toThrowError("Negative numbers are not allowed");
    });
});
