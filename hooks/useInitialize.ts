import {useEffect, useRef} from "react";
import io from "socket.io-client";
import {peerActions, useAppDispatch} from "@/store";
import createId from "@/utils/createId";
import {Peer} from "@/types";
import createConnection from "@/utils/createConnection";

function useInitialize(peer: Peer) {

    const {peerId, answer, status, senderSocketId, offer, requests, socket, iceCandidates} = peer;
    const dispatch = useAppDispatch();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);


    useEffect(() => {
        const peerId = createId();
        const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL!).connect();
        createConnection({dispatch, remoteVideoRef});
        dispatch(peerActions.setLocalVideoRef(localVideoRef));
        dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
        dispatch(peerActions.setPeerId(peerId));
        dispatch(peerActions.setSocket(socketConnection));

    }, []);

    useEffect(() => {
        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && offer && status?.endsWith(":send")) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("requestToServer", {iceCandidates, offer, peerId, status});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);
    useEffect(() => {

        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && answer && status?.endsWith(":receive") && senderSocketId) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("responseToServer", {iceCandidates, answer, peerId, socketId: senderSocketId, status});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);


    return {localVideoRef, remoteVideoRef};

}

export default useInitialize;