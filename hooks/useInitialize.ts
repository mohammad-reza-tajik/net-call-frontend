import {useEffect, useRef} from "react";
import io from "socket.io-client";
import {devicesActions, peerActions, useAppDispatch} from "@/store";
import createId from "@/utils/createId";
import {Peer} from "@/types";
import createConnection from "@/utils/createConnection";
import getDevices from "@/utils/getDevices";
import {toast} from "react-toastify";
import hangup from "@/utils/hangup";

function useInitialize(peer: Peer) {

    const {peerId, peerConnection, answer, status, offer, socket, iceCandidates, currentRequest} = peer;
    const dispatch = useAppDispatch();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        (async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({video : true ,audio: true});
            const peerId = createId();
            createConnection({dispatch});
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!).connect();
            const {videoInputs, audioInputs, audioOutputs} = await getDevices();
            dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
            dispatch(peerActions.setLocalVideoRef(localVideoRef));
            dispatch(peerActions.setPeerId(peerId));
            dispatch(devicesActions.setAudioInputs(audioInputs));
            dispatch(devicesActions.setAudioOutputs(audioOutputs));
            dispatch(devicesActions.setVideoInputs(videoInputs));
            dispatch(peerActions.setLocalStream(localStream));
            dispatch(peerActions.setSocket(socket));
        })();
    }, []);

    useEffect(() => {
        if (peerConnection && !status) {
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
                    hangup({dispatch, peer});
                }
            })

            peerConnection.addEventListener("track", (event) => {
                const remoteStream = event.streams.at(0);
                dispatch(peerActions.setRemoteStream(remoteStream));
                if (remoteVideoRef?.current && remoteStream) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            })
        }
    }, [peerConnection]);


    useEffect(() => {
        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && offer && status?.endsWith(":send")) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("requestToServer", {iceCandidates, offer, peerId, status, socketId: socket.id});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);

    useEffect(() => {

        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && answer && status?.endsWith(":receive") && currentRequest?.socketId) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("responseToServer", {
                    iceCandidates,
                    answer,
                    peerId,
                    socketId: currentRequest.socketId,
                    status
                });
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);


    return {localVideoRef, remoteVideoRef};

}

export default useInitialize;