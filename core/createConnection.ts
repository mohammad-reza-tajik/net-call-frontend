import peerConnectionListeners from "@/core/peerConnectionListeners";
import type { ManagedPeerConnection } from "@/types";

function createConnection() {
  const peerConfig: RTCConfiguration = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
  };
  const peerConnection = new RTCPeerConnection(peerConfig) as ManagedPeerConnection;
  peerConnection.abortController = peerConnectionListeners(peerConnection);
  return peerConnection;
}

export default createConnection;
