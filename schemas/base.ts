import { z } from "zod";

export const statusSchema = z.enum([
    "screen:send", "screen:receive",
    "video:send", "video:receive",
    "audio:send", "audio:receive",
    "game:send", "game:receive",
]);

export const deviceTypeSchema = z.enum(["desktop", "mobile"]);

export const visibilitySchema = z.enum(["visible", "hidden"]);