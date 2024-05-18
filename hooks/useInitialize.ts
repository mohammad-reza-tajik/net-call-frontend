import {useEffect, useRef} from "react";
import io from "socket.io-client";
import {devicesActions, peerActions, useAppDispatch} from "@/store";
import createId from "@/utils/createId";
import {Peer} from "@/types";
import createConnection from "@/utils/createConnection";
import getDevices from "@/utils/getDevices";

function useInitialize(peer: Peer) {

    const {peerId, answer, status, offer, socket, iceCandidates , currentRequest} = peer;
    const dispatch = useAppDispatch();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        (async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({audio: true,video : true});
            const peerId = createId();
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!).connect();
            const {videoInputs , audioInputs , audioOutputs} = await getDevices();
            createConnection({dispatch, remoteVideoRef});
            dispatch(peerActions.setLocalVideoRef(localVideoRef));
            dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
            dispatch(peerActions.setPeerId(peerId));
            dispatch(devicesActions.setAudioInputs(audioInputs));
            dispatch(devicesActions.setAudioOutputs(audioOutputs));
            dispatch(devicesActions.setVideoInputs(videoInputs));
            dispatch(peerActions.setLocalStream(localStream));
            dispatch(peerActions.setSocket(socket));
        })();
    }, []);

    useEffect(() => {
        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && offer && status?.endsWith(":send")) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("requestToServer", {iceCandidates, offer, peerId, status , socketId: socket.id});
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
                socket?.emit("responseToServer", {iceCandidates, answer, peerId, socketId: currentRequest.socketId, status});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);


    return {localVideoRef, remoteVideoRef};

}

export default useInitialize;