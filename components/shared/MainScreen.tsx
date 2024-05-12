"use client"

import {cn} from "@/lib/utils";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import {useAppSelector} from "@/store";

function MainScreen() {

    const peer = useAppSelector(state => state.peer);
    const {socket , videoRef , status} = peer;

    useInitialize(peer);
    useSocket(socket);

    return (
        <section className={"flex flex-1 items-center justify-around"}>
            <video ref={videoRef} controls autoPlay className={cn("size-full", {"hidden": !status})}/>
        </section>
    )
}

export default MainScreen;