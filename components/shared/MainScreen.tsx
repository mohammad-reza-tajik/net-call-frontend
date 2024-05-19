"use client"

import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import {useAppSelector} from "@/store";
import AudioCall from "@/components/screens/AudioCall";
import {cn} from "@/lib/utils";
import ScreenSend from "@/components/screens/ScreenSend";

function MainScreen() {

    const peer = useAppSelector(state => state.peer);
    const {socket, status, signallingState , connectionState} = peer;

    const {localVideoRef, remoteVideoRef} = useInitialize(peer);
    useSocket(socket);

    function renderScreen() {
        if (!status) {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                برای شروع یکی از گزینه های زیر را انتخاب کنید
            </p>
        } else if (signallingState === "have-local-offer") {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                در انتظار پاسخ ...
            </p>
        } else if (status === "screen:send") {
            return <ScreenSend peer={peer}/>
        } else if (status.startsWith("audio:") && connectionState === "connected") {
            return <AudioCall peer={peer} />
        } else if (status.startsWith("video:") || status === "screen:receive") {
            return
        }
    }

    return (
        <section className={"flex-1 flex overflow-hidden relative"}>
            {renderScreen()}

            <video ref={localVideoRef} controls autoPlay
                   className={cn("absolute top-5 right-5 w-64 h-36", {"hidden": !status?.startsWith("video:")})}/>

            <video ref={remoteVideoRef} controls autoPlay
                   className={cn("size-full", {"hidden": !status?.startsWith("video:") && status !== "screen:receive"})}/>
        </section>
    )
}

export default MainScreen;