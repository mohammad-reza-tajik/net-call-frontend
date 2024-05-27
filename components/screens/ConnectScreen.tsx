"use client"

import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import AudioCall from "@/components/screens/AudioCall";
import {cn} from "@/lib/utils";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import {useEffect, useRef} from "react";
import createAnswer from "@/utils/createAnswer";
import statusSignal from "@/signals/peer/status";

function ConnectScreen() {

    const peer = useAppSelector(state => state.peer);
    const { signallingState, connectionState , currentRequest} = peer;

    const dispatch = useAppDispatch();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        dispatch(peerActions.setRemoteVideoRef(remoteVideoRef));
        dispatch(peerActions.setLocalVideoRef(localVideoRef));
    }, []);

    useEffect(() => {
        (async () => {
            if (currentRequest && peer.localVideoRef) {
                await createAnswer({request: currentRequest, peer, dispatch});
            }
        })();
    }, [peer.localVideoRef]);


    function renderScreen() {
        if (!statusSignal.value) {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید
            </p>
        } else if (signallingState === "have-local-offer") {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                در انتظار پاسخ ...
            </p>
        } else if (statusSignal.value === "screen:send") {
            return <ScreenSend peer={peer}/>
        } else if (statusSignal.value.startsWith("audio:") && connectionState === "connected") {
            return <AudioCall peer={peer}/>
        } else if (statusSignal.value.startsWith("video:") || statusSignal.value === "screen:receive") {
            return
        }
    }

    return (
        <section className={"flex-1 flex flex-col relative"}>

            {renderScreen()}

            <video ref={localVideoRef} controls autoPlay
                   className={cn("absolute top-5 right-5 w-64 h-36", {"hidden": !statusSignal.value?.startsWith("video:")})}/>

            <video ref={remoteVideoRef} controls autoPlay
                   className={cn("size-full", {"hidden": !statusSignal.value?.startsWith("video:") && statusSignal.value !== "screen:receive"})}/>
            <ActionBar/>
        </section>
    )
}

export default ConnectScreen;