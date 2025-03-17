import peerConnectionListeners from "@/core/peerConnectionListeners";
import type { ManagedPeerConnection } from "@/types";
import toast from "react-hot-toast";

function createConnection() {
    try {
        const peerConfig: RTCConfiguration = {
            iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
        };
        const peerConnection = new RTCPeerConnection(peerConfig) as ManagedPeerConnection;
        peerConnection.abortController = peerConnectionListeners(peerConnection);
        return peerConnection;
    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
            console.error(err);
        }
    }
}

export default createConnection;
