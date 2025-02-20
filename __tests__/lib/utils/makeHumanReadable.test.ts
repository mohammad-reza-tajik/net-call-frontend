import { describe, it, expect } from "vitest";
import makeHumanReadable from "@/lib/utils/makeHumanReadable";

describe("makeHumanReadable()", () => {
    it("should return '0.00' for 0", () => {
        const result = makeHumanReadable(0);
        expect(result).toBe("0.00");
    });

    it("should return '999.00' for 999", () => {
        const result = makeHumanReadable(999);
        expect(result).toBe("999.00");
    });

    it("should return '1.00K' for 1000", () => {
        const result = makeHumanReadable(1000);
        expect(result).toBe("1.00K");
    });

    it("should return '1.23K' for 1234", () => {
        const result = makeHumanReadable(1234);
        expect(result).toBe("1.23K");
    });

    it("should return '1.00M' for 1000000", () => {
        const result = makeHumanReadable(1000000);
        expect(result).toBe("1.00M");
    });

    it("should return '1.23M' for 1234567", () => {
        const result = makeHumanReadable(1234567);
        expect(result).toBe("1.23M");
    });

    it("should return '1.00G' for 1000000000", () => {
        const result = makeHumanReadable(1000000000);
        expect(result).toBe("1.00G");
    });

    it("should return '1.23G' for 1234567890", () => {
        const result = makeHumanReadable(1234567890);
        expect(result).toBe("1.23G");
    });

    it("should return '1.00T' for 1000000000000", () => {
        const result = makeHumanReadable(1000000000000);
        expect(result).toBe("1.00T");
    });

    it("should return '1.23T' for 1234567890123", () => {
        const result = makeHumanReadable(1234567890123);
        expect(result).toBe("1.23T");
    });

    it("should return '1.00P' for 1000000000000000", () => {
        const result = makeHumanReadable(1000000000000000);
        expect(result).toBe("1.00P");
    });

    it("should return '1.23P' for 1234567890123456", () => {
        const result = makeHumanReadable(1234567890123456);
        expect(result).toBe("1.23P");
    });

    it("should return '1.00E' for 1000000000000000000", () => {
        const result = makeHumanReadable(1000000000000000000);
        expect(result).toBe("1.00E");
    });

    it("should return '1.23E' for 1234567890123456789", () => {
        const result = makeHumanReadable(1234567890123456789);
        expect(result).toBe("1.23E");
    });

    it("should return '1.00E' for 999999999999999999", () => {
        const result = makeHumanReadable(999999999999999999);
        expect(result).toBe("1.00E");
    });
});