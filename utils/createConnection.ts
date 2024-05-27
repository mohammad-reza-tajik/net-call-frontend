function createConnection() {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]}
    return new RTCPeerConnection(peerConfig);
}

export default createConnection;