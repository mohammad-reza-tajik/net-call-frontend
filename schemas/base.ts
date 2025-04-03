import { z } from "zod";

export const visibilitySchema = z.enum(["visible", "hidden"]);
