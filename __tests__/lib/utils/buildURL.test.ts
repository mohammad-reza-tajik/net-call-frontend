import buildURL from "@/lib/utils/buildURL";
import { describe, it, expect } from "vitest";

describe("buildURL()", () => {
    // Test relative path
    it("should build URL with a relative path", () => {
        const options = {
            url: "/",
            query: {
                hello: "world"
            }
        };
        const result = buildURL(options);
        expect(result).toBe(`${window.location.origin}/?hello=world`);
    });

    // Test absolute URL
    it("should build URL with an absolute URL", () => {
        const options = {
            url: "https://example.com/",
            query: {
                hello: "world"
            }
        };
        const result = buildURL(options);
        expect(result).toBe("https://example.com/?hello=world");
    });

    // Test null and undefined query parameters
    it("should ignore null and undefined query parameters", () => {
        const options = {
            url: "/",
            query: {
                hello: "world",
                nullValue: null,
                undefinedValue: undefined
            }
        };
        const result = buildURL(options);
        expect(result).toBe(`${window.location.origin}/?hello=world`);
    });

    // Test hash fragment
    it("should include hash fragment in the URL", () => {
        const options = {
            url: "/",
            query: {
                hello: "world"
            },
            hash: "section1"
        };
        const result = buildURL(options);
        expect(result).toBe(`${window.location.origin}/?hello=world#section1`);
    });

    // Test empty hash fragment
    it("should handle empty hash fragment", () => {
        const options = {
            url: "/",
            query: {
                hello: "world"
            },
            hash: ""
        };
        const result = buildURL(options);
        expect(result).toBe(`${window.location.origin}/?hello=world`);
    });

    // Test undefined URL with query and hash
    it("should return only query and hash if URL is undefined", () => {
        const options = {
            query: {
                hello: "world"
            },
            hash: "section1"
        };
        const result = buildURL(options);
        expect(result).toBe("?hello=world#section1");
    });

    // Test undefined URL with only query
    it("should return only query if URL is undefined and hash is not provided", () => {
        const options = {
            query: {
                hello: "world"
            }
        };
        const result = buildURL(options);
        expect(result).toBe("?hello=world");
    });

    // Test undefined URL with only hash
    it("should return only hash if URL is undefined and query is not provided", () => {
        const options = {
            hash: "section1"
        };
        const result = buildURL(options);
        expect(result).toBe("#section1");
    });

    // Test undefined URL with no query or hash
    it("should return empty string if URL is undefined and no query or hash is provided", () => {
        const options = {};
        const result = buildURL(options);
        expect(result).toBe("");
    });
});
