import {useEffect, useRef} from "react";
import io from "socket.io-client";
import {peerActions, useAppDispatch} from "@/store";
import createConnection from "@/utils/createConnection";
import createId from "@/utils/createId";
import {Peer} from "@/types";

function useInitialize(peer : Peer) {

    const {peerId , answer, status , senderSocketId, offer,requests, socket, iceCandidates} = peer;
    const dispatch = useAppDispatch();
    const videoRef = useRef<HTMLVideoElement | null>(null);


    useEffect(() => {
        (async () => {
            const peerId = createId();

            const peerConnection = await createConnection({dispatch, videoRef});
            const socketConnection = io("http://localhost:3001").connect();

            dispatch(peerActions.setPeerConnection(peerConnection));
            dispatch(peerActions.setPeerId(peerId));
            dispatch(peerActions.setSocket(socketConnection));
            dispatch(peerActions.setVideoRef(videoRef));

        })();

    }, []);

    useEffect(() => {
        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && offer && status?.endsWith(":send")) {
            // @ts-ignore
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("requestToServer", {iceCandidates, offer, peerId});
                // todo send status with the requests to server
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
                socket?.emit("responseToServer", {iceCandidates, answer, peerId , socketId : senderSocketId});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);


    return videoRef;

}

export default useInitialize;