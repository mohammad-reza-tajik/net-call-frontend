import {describe, expect, it} from "vitest";
import isValidUUID from "@/lib/utils/isValidUUID";

describe("isValidUUID()", () => {
    describe("should return true for",()=>{

    // Test for valid UUID v4
    it("a valid UUID v4 with lowercase letters", () => {

        const validUUID = "550e8400-e29b-41d4-a716-446655440000"; // Fixed UUID v4

        const result = isValidUUID(validUUID);

        expect(result).toBe(true);
    });

    it("a valid UUID v4 with uppercase letters", () => {

        const invalidUUID = "550E8400-E29B-41D4-A716-446655440000"; // Uppercase UUID

        const result = isValidUUID(invalidUUID);

        expect(result).toBe(true); // Should still be valid due to case-insensitivity
    });
    })

    // Test for invalid UUIDs
    describe("should return false for", () => {
        it("an invalid UUID with one character removed", () => {

            const invalidUUID = "550e8400-e29b-41d4-a716-44665544000"; // Missing one character

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });

        it("a random string", () => {

            const invalidUUID = "hello world";

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });

        it("an empty string", () => {

            const invalidUUID = "";

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });

        it("a string with invalid characters", () => {

            const invalidUUID = "550e8400-e29b-41d4-a716-4466554400g0"; // Invalid character 'g'

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });

        it("a string with incorrect hyphen placement", () => {

            const invalidUUID = "550e8400e-29b-41d4-a716-446655440000"; // Incorrect hyphen placement

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });

        it("a UUID of a different version (v1)", () => {

            const invalidUUID = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // UUID v1

            const result = isValidUUID(invalidUUID);

            expect(result).toBe(false);
        });
    });
});
