"use client"

import AudioCall from "@/components/screens/AudioCall";
import {cn} from "@/lib/utils";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import {useEffect, useRef} from "react";
import createAnswer from "@/utils/createAnswer";
import statusSignal from "@/signals/peer/status";
import {signalingStateSignal, connectionStateSignal} from "@/signals/peer/peerConnection";
import currentRequestSignal from "@/signals/peer/currentRequest";
import {useSignalEffect, useSignals} from "@preact/signals-react/runtime";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import localVideoRefSignal from "@/signals/localVideoRef";
import {useSearchParams} from "next/navigation";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import Chat from "@/components/screens/Chat";
import Drawer from "@/components/shared/Drawer";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import Loader from "@/components/shared/Loader";
import {Button} from "@/components/ui/button";
import hangup from "@/utils/hangup";

function ConnectScreen() {

    useSignals();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    const remotePeerIdQuery = useSearchParams().get("remotePeerId");

    useEffect(() => {
        if (!remotePeerIdSignal.value && remotePeerIdQuery) {
            remotePeerIdSignal.value = remotePeerIdQuery;
        }
    }, [remotePeerIdQuery]);

    useEffect(() => {
        remoteVideoRefSignal.value = remoteVideoRef;
        localVideoRefSignal.value = localVideoRef;
    }, []);


    useSignalEffect(() => {
        (async () => {
            if (currentRequestSignal.value) {
                await createAnswer({request: currentRequestSignal.value});
            }
        })();
    })


    function renderScreen() {
        if (!statusSignal.value) {
            return <p className={"flex justify-center items-center text-xl flex-1"}>
                برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید
            </p>
        } else if (signalingStateSignal.value === "have-local-offer" && connectionStateSignal.value !== "connecting") {
            return <div className={"flex flex-col gap-5 justify-center items-center text-xl flex-1"}>
                <p>
                    در انتظار پاسخ ...
                </p>
                <Button onClick={hangup}>انصراف</Button>
            </div>
        } else if (connectionStateSignal.value === "connecting") {
            return <div className={"flex flex-col gap-5 justify-center items-center text-xl flex-1"}>
                <p>در حال اتصال ...</p>
                <Loader className={"size-10"}/>
            </div>
        } else if (statusSignal.value === "screen:send") {
            return <ScreenSend/>
        } else if (statusSignal.value.startsWith("audio:") && connectionStateSignal.value === "connected") {
            return <AudioCall/>
        } else if (statusSignal.value.startsWith("video:") || statusSignal.value === "screen:receive") {
            return
        }
    }

    return (
        <>
            <Drawer openSignal={isChatDrawerOpenSignal} className={"sm:w-1/2"}>
                <Chat/>
            </Drawer>
            <section className={"flex-1 flex flex-col relative overflow-hidden items-center"}>
                {renderScreen()}

                <video ref={localVideoRef} controls autoPlay
                       className={cn("absolute top-5 right-5 w-64 h-36", {"hidden": !statusSignal.value?.startsWith("video:") || connectionStateSignal.value !== "connected"})}/>

                <video ref={remoteVideoRef} controls autoPlay
                       className={cn("size-full", {"hidden": !statusSignal.value?.startsWith("video:") && statusSignal.value !== "screen:receive" || connectionStateSignal.value !== "connected"})}/>
                <ActionBar/>
            </section>
        </>
    )
}

export default ConnectScreen;