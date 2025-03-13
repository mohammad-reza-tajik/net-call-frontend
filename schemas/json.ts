import { z } from "zod";

type Json = { [key: string]: Json } | Json[];

export const jsonSchema: z.ZodType<Json> = z.lazy(() => z.union([z.array(jsonSchema), z.record(jsonSchema)]));
