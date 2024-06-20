import peerConnectionListeners from "@/utils/peerConnectionListeners";

function createConnection() {

    const peerConfig : RTCConfiguration = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]};
    const peerConnection =  new RTCPeerConnection(peerConfig);
    peerConnection.createDataChannel("dummy");

    peerConnectionListeners(peerConnection);

}

export default createConnection;