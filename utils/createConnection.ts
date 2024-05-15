import {peerActions} from "@/store/peerSlice";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
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

    peerConnection.addEventListener("signalingstatechange", (event) => {
        console.log(peerConnection.signalingState);
    })

    peerConnection.addEventListener("connectionstatechange", async (event) => {

        peerConnection.addEventListener("connectionstatechange", async (event) => {
            console.log(peerConnection.connectionState);
            let toastId: number | string;

            if (peerConnection.connectionState === "connecting") {
                toastId = toast.loading("در حال اتصال ...");
            } else if (peerConnection.connectionState === "connected") {
                toast.dismiss(toastId!);
                toast.success("متصل شدید")
            } else if (peerConnection.connectionState === "disconnected") {
                toast.error("ارتباط قطع شد");
            }
        });
    })

    peerConnection.addEventListener("track", (event) => {
        if (remoteVideoRef?.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    })

    dispatch(peerActions.setPeerConnection(peerConnection));

    return peerConnection;
}

export default createConnection;