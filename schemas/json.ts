import { z } from "zod";

export const jsonSchema = z.string().refine((str) => {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}, "Invalid JSON string");
