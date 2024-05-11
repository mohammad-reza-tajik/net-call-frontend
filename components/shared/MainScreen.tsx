"use client"

import {useEffect} from "react";
import createId from "@/utils/createId";
import {peerActions, useAppDispatch} from "@/store";
import createConnection from "@/utils/createConnection";
import io from "socket.io-client";

function MainScreen() {


    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            const peerId = createId();
            const socketConnection = io("http://localhost:3001").connect();
            dispatch(peerActions.setPeer({socket: socketConnection, peerId}));
        })();

    }, []);


    return (
        <section className={"flex flex-1 items-center justify-around"}>
            {/*<video ref={videoRef} controls playsInline autoPlay className={cn("size-full",{"hidden": !status})} />*/}
        </section>
    )
}

export default MainScreen;