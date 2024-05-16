"use client"

import {cn} from "@/lib/utils";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import {useAppSelector} from "@/store";

function MainScreen() {

    const peer = useAppSelector(state => state.peer);
    const {socket, status} = peer;

    const {localVideoRef, remoteVideoRef} = useInitialize(peer);
    useSocket(socket);

    return (
        <section className={"flex-1 flex overflow-hidden"}>
            {
                !status &&
                <h1 className={"flex justify-center items-center text-xl flex-1"}>
                    برای شروع یکی از گزینه های زیر را انتخاب کنید
                </h1>
            }


            <video ref={localVideoRef} controls autoPlay
                   className={cn("size-full", {"hidden": !status?.startsWith("video:")})}/>

            <video ref={remoteVideoRef} controls autoPlay
                   className={cn("size-full", {"hidden": !status?.endsWith(":receive")})}/>


        </section>
    )
}

export default MainScreen;