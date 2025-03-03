import { v4 as uuid } from "uuid";
import {DomainError} from "./error";

export class PositiveNumber {
    private constructor(readonly value: number) {}

    static create(value: number): PositiveNumber {
        if (value < 0) {
            throw new DomainError("Negative numbers are not allowed");
        }
        return new PositiveNumber(value);
    }
}

export class Address {
    private constructor(readonly value: string) {
    }

    static create(value: string): Address {
        if (!value || value.trim() === "") {
            throw new DomainError("Address cannot be empty");
        }
        return new Address(value);
    }
}

export class Id{
    private constructor(readonly value: string) {}

    static create(): Id {
        return new Id(uuid());
    }
}
