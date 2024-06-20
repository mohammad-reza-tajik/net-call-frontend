import peerConnectionListeners from "@/utils/peerConnectionListeners";

function createConnection() {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]};
    const peerConnection = new RTCPeerConnection(peerConfig);
    peerConnection.createDataChannel("dummy");

    peerConnectionListeners(peerConnection);

    return peerConnection;

}

export default createConnection;