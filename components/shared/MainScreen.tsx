"use client"

import {useEffect, useRef} from "react";
import createId from "@/utils/createId";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import createConnection from "@/utils/createConnection";
import io from "socket.io-client";
import {cn} from "@/lib/utils";

function MainScreen() {

    const peer = useAppSelector(state => state.peer);
    const {peerId, status , offer, socket, iceCandidates} = peer;
    const dispatch = useAppDispatch();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        (async () => {
            const peerId = createId();
            const peerConnection = await createConnection({dispatch, peer});

            const socketConnection = io("http://localhost:3001").connect();

            dispatch(peerActions.setPeerConnection(peerConnection));
            dispatch(peerActions.setPeerId(peerId));
            dispatch(peerActions.setSocket(socketConnection));
            dispatch(peerActions.setVideoRef(videoRef));

        })();

    }, []);

    useEffect(() => {
        let candidateTimeout: NodeJS.Timeout;

        if (iceCandidates!.length > 0 && offer) {
            clearTimeout(candidateTimeout);

            candidateTimeout = setTimeout(() => {
                socket?.emit("offerToServer", {iceCandidates,offer,peerId});
            }, 1000)
        }

        return () => clearTimeout(candidateTimeout)

    }, [iceCandidates]);


    return (
        <section className={"flex flex-1 items-center justify-around"}>
            <video ref={videoRef} controls autoPlay className={cn("size-full", {"hidden": !status})}/>
        </section>
    )
}

export default MainScreen;