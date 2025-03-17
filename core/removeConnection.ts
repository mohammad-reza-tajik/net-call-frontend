import type { ManagedPeerConnection } from "@/types";

function removeConnection(peerConnection: ManagedPeerConnection | undefined) {
    if (!peerConnection) return;

    // Abort all listeners
    peerConnection.abortController?.abort();

    // Close the connection (closes all data channels)
    peerConnection.close();
}

export default removeConnection;
