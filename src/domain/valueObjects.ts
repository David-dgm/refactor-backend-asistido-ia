export class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new Error("Negative numbers are not allowed");
        }
        return new PositiveNumber(value);
    }
}

export class Address {
    private constructor(readonly value: string) {
    }

    static create(value: string): Address {
        if (!value || value.trim() === "") {
            throw new Error("Address cannot be empty");
        }
        return new Address(value);
    }
}
