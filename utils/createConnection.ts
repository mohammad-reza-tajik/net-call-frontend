import {peerActions} from "@/store/peerSlice";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {MutableRefObject} from "react";

async function createConnection({dispatch, videoRef}: { dispatch: ThunkDispatch,  videoRef :MutableRefObject<HTMLVideoElement | null> }) {

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
        console.log("tracks received");
        if (videoRef?.current) {
            videoRef.current.srcObject = event.streams[0];

        }
    })

    return peerConnection;
}

export default createConnection;