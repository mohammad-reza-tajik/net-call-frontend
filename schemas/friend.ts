import { z } from "zod";

export const friendSchema = z.object({
    isOnline: z.boolean(),
    localPeerId: z.string().uuid("localPeerId must be a valid UUID"),
    name: z.string().min(1, "name must be at least 1 character"),
});
