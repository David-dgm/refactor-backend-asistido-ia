class PositiveNumber {
    constructor(readonly value: number) {
        if (value < 0) {
            throw new Error("Negative numbers are not allowed");
        }
    }
}

describe("A positive number", () => {
    it("allows positive values", ()=>{
        const aPositiveNumber = new PositiveNumber(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it("does not allow negative values", ()=>{
        expect(() => new PositiveNumber(-1)).toThrowError("Negative numbers are not allowed");
    });
});
