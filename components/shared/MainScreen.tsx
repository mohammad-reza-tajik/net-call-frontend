"use client"

import {cn} from "@/lib/utils";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import {useAppSelector} from "@/store";

function MainScreen() {

    const peer = useAppSelector(state => state.peer);
    const {socket, status} = peer;

    const {localVideoRef , remoteVideoRef} = useInitialize(peer);
    useSocket(socket);

    return (
        <section className={"flex-1 flex"}>

            <h1 className={cn("text-xl",{"hidden":status})}>
                برای شروع یکی از گزینه های زیر را انتخاب کنید
            </h1>
            <p className={cn("flex-1 flex justify-center items-center bg-primary",{"hidden":status !== "screen:send"})}>
                صفحه شما به اشتراک گذاشته شده است
            </p>

            <video ref={localVideoRef} controls autoPlay className={cn("size-full", {"hidden": !status?.endsWith(":receive")})}/>
            <video ref={remoteVideoRef} controls autoPlay className={cn("size-full", {"hidden": !status?.endsWith(":receive")})}/>

        </section>
    )
}

export default MainScreen;