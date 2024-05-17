import {peerActions} from "@/store/peerSlice";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {MutableRefObject} from "react";
import {toast} from "react-toastify";

function createConnection({dispatch, remoteVideoRef}: {
    dispatch: ThunkDispatch,
    remoteVideoRef: MutableRefObject<HTMLVideoElement | null>
}) {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]}
    const peerConnection = new RTCPeerConnection(peerConfig);

    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            dispatch(peerActions.addIceCandidate(event.candidate));
        }
    });

    peerConnection.addEventListener("signalingstatechange", () => {
        console.log(peerConnection.signalingState);
        dispatch(peerActions.setSignallingState(peerConnection.signalingState));
    })

    peerConnection.addEventListener("connectionstatechange", async () => {
        console.log(peerConnection.connectionState);
        dispatch(peerActions.setConnectionState(peerConnection.connectionState));
        let toastId: number | string;

        if (peerConnection.connectionState === "connecting") {
            toastId = toast.loading("در حال اتصال ...");
        } else if (peerConnection.connectionState === "connected") {
            toast.dismiss(toastId!);
            toast.success("متصل شدید");
        } else if (peerConnection.connectionState === "disconnected") {
            toast.error("ارتباط قطع شد");
        }
    })

    peerConnection.addEventListener("track", (event) => {
        const remoteStream = event.streams.at(0);
        dispatch(peerActions.setRemoteStream(remoteStream));
        if (remoteVideoRef?.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    })

    dispatch(peerActions.setPeerConnection(peerConnection));

    return peerConnection;
}

export default createConnection;