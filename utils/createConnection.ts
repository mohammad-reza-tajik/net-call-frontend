async function createConnection() {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1,l.google.com:19302"]}]};
    const peerConnection = new RTCPeerConnection(peerConfig);

    peerConnection.addEventListener("icecandidate" ,(event) => {
        console.log(event)
    });

    peerConnection.addEventListener("signalingstatechange",(event)=>{
        console.log(event);
    })

    return peerConnection;
}

export default createConnection;