"use client"

import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import AudioCall from "@/components/screens/AudioCall";
import {cn} from "@/lib/utils";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import {useEffect, useRef} from "react";

function ConnectScreen() {

    const peer = useAppSelector(state => state.peer);
    const {status, signallingState, connectionState} = peer;

    const dispatch = useAppDispatch();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
        dispatch(peerActions.setLocalVideoRef(localVideoRef));
    }, []);


    function renderScreen() {
        if (!status) {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید
            </p>
        } else if (signallingState === "have-local-offer") {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                در انتظار پاسخ ...
            </p>
        } else if (status === "screen:send") {
            return <ScreenSend peer={peer}/>
        } else if (status.startsWith("audio:") && connectionState === "connected") {
            return <AudioCall peer={peer}/>
        } else if (status.startsWith("video:") || status === "screen:receive") {
            return
        }
    }

    return (
        <section className={"flex-1 flex flex-col relative"}>

            {renderScreen()}

             <video ref={localVideoRef} controls autoPlay
                   className={cn("absolute top-5 right-5 w-64 h-36", {"hidden": !status?.startsWith("video:")})}/>

            <video ref={remoteVideoRef} controls autoPlay
                   className={cn("size-full", {"hidden": !status?.startsWith("video:") && status !== "screen:receive"})}/>
            <ActionBar/>
        </section>
    )
}

export default ConnectScreen;