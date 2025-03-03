export class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error("Negative numbers are not allowed");
        }
        return new PositiveNumber(value);
    }
}
