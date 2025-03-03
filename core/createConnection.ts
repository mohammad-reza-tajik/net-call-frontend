import peerConnectionListeners from "@/core/peerConnectionListeners";
import dataChannelListeners from "@/core/dataChannelListeners";
import chatChannelListeners from "@/core/chatChannelListeners";

function createConnection() {

    const peerConfig : RTCConfiguration = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]};
    const peerConnection =  new RTCPeerConnection(peerConfig);

    peerConnectionListeners(peerConnection);

    // we create chat channel beforehand cause it is needed for any type of connection
    const chatChannel = peerConnection.createDataChannel("chat",{
        negotiated : true,
        id : 1
    });

    dataChannelListeners(chatChannel);
    chatChannelListeners(chatChannel);

}

export default createConnection;