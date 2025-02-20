import { describe, it, expect } from "vitest";
import range from "@/lib/utils/range";

describe("range()", () => {
    it("should generate an array with the correct range of numbers", () => {
        const result1 = range(1, 5);
        const result2 = range(0, 0);
        const result3 = range(-2, 2);

        expect(result1).toEqual([1, 2, 3, 4, 5]);
        expect(result2).toEqual([0]);
        expect(result3).toEqual([-2, -1, 0, 1, 2]);
    });

    it("should handle cases where start is greater than end", () => {
        const result = range(5, 1);
        expect(result).toEqual([]);
    });

    it("should handle negative ranges correctly", () => {
        const result = range(-5, -1);
        expect(result).toEqual([-5, -4, -3, -2, -1]);
    });

    it("should handle single element range", () => {
        const result = range(10, 10);
        expect(result).toEqual([10]);
    });
});