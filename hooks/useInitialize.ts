import {useEffect, useRef} from "react";
import io from "socket.io-client";
import {devicesActions, peerActions, useAppDispatch, useAppSelector} from "@/store";
import createId from "@/utils/createId";
import createConnection from "@/utils/createConnection";
import getDevices from "@/utils/getDevices";
import {toast} from "react-toastify";
import hangup from "@/utils/hangup";

function useInitialize() {

    const peer = useAppSelector(state => state.peer);
    const {localPeerId, peerConnection, answer, status, offer, socket, iceCandidates, currentRequest} = peer;
    const dispatch = useAppDispatch();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        (async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({audio: true});
            const localPeerId = createId({dispatch});
            createConnection({dispatch});
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                query: {
                    peerId : localPeerId
                }
            }).connect();
            const {videoInputs, audioInputs, audioOutputs} = await getDevices();
            dispatch(peerActions.setSocket(socket));
            dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
            dispatch(peerActions.setLocalVideoRef(localVideoRef));
            dispatch(devicesActions.setAudioInputs(audioInputs));
            dispatch(devicesActions.setAudioOutputs(audioOutputs));
            dispatch(devicesActions.setVideoInputs(videoInputs));
            dispatch(peerActions.setLocalStream(localStream));
        })();
    }, []);

    useEffect(() => {
        if (peerConnection) {
            peerConnection.addEventListener("icecandidate", (event) => {
                if (event.candidate) {
                    dispatch(peerActions.addIceCandidate(event.candidate));
                }
            });

            peerConnection.addEventListener("signalingstatechange", () => {
                dispatch(peerActions.setSignallingState(peerConnection.signalingState));
            })

            peerConnection.addEventListener("connectionstatechange", () => {
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
                socket?.emit("requestToServer", {iceCandidates, offer, localPeerId, status, socketId: socket.id});
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
                    localPeerId,
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