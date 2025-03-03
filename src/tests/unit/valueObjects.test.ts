class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error("Negative numbers are not allowed");
        }
        return new PositiveNumber(value);
    }
}

describe("A positive number", () => {
    it("allows positive values", ()=>{
        const aPositiveNumber = PositiveNumber.create(1);
        expect(aPositiveNumber.value).toBe(1);
    });

    it("does not allow negative values", ()=>{
        expect(() => PositiveNumber.create(-1)).toThrowError("Negative numbers are not allowed");
    });
});
