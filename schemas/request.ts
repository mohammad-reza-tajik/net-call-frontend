import { z } from "zod";
import { statusSchema } from "@/schemas/base";

export const requestSchema = z.object({
    offer: z.object({
        type: z.enum(["offer"]),
        sdp: z.string().min(1, "SDP must be a non-empty string"),
    }).passthrough(),
    status: statusSchema,
    localPeerId: z.string().uuid("localPeerId must be a valid UUID"),
    remotePeerId: z.string().uuid("remotePeerId must be a valid UUID"),
    socketId: z.string().min(1, "socketId must be a non-empty string"),
    iceCandidates: z.array(
        z.object({
            candidate: z.string().min(1, "Candidate must be a non-empty string"),
            sdpMid: z.string().nullable(),
            sdpMLineIndex: z.number().int().nonnegative().nullable(),
        }).passthrough()
    ),
});