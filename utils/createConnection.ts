import peerConnectionListeners from "@/utils/peerConnectionListeners";
import dataChannelListeners from "@/utils/dataChannelListeners";

function createConnection() {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]};
    const peerConnection =  new RTCPeerConnection(peerConfig);
    const localChatChannel = peerConnection.createDataChannel("chat");
    const localFileChannel = peerConnection.createDataChannel("file");

    dataChannelListeners(localChatChannel);
    dataChannelListeners(localFileChannel);
    peerConnectionListeners(peerConnection);

    return peerConnection;

}

export default createConnection;