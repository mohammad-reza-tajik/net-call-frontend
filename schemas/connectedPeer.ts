import { z } from "zod";
import { deviceTypeSchema, visibilitySchema } from "@/schemas/base";

export const connectedPeerSchema = z.object({
    socketId: z.string().min(1, "socketId must be a non-empty string"),
    localPeerId: z.string().uuid("localPeerId must be a valid UUID"),
    deviceType: deviceTypeSchema,
    visibility: visibilitySchema,
});