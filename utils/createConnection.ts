import {peerActions} from "@/store/peerSlice";
import {Peer} from "@/types";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";

async function createConnection({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]}
    const peerConnection = new RTCPeerConnection(peerConfig);

    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            dispatch(peerActions.addIceCandidate(event.candidate));
        }
    });

    /*peerConnection.addEventListener("signalingstatechange", (event) => {
        console.log(peerConnection.signalingState);
    })*/

    peerConnection.addEventListener("track", (event) => {
        console.log(event);
        /*if (videoRef?.current) {
            videoRef.current.srcObject = event.streams[0];

        }*/
    })

    return peerConnection;
}

export default createConnection;