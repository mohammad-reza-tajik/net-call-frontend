"use client"

import AudioCall from "@/components/screens/AudioCall";
import cn from "@/lib/utils/cn";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import {Suspense, useEffect, useRef} from "react";
import createAnswer from "@/core/createAnswer";
import statusSignal from "@/signals/peer/status";
import {connectionStateSignal, peerConnectionSignal, signalingStateSignal} from "@/signals/peer/peerConnection";
import currentRequestSignal from "@/signals/peer/currentRequest";
import {useSignalEffect, useSignals} from "@preact/signals-react/runtime";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import localVideoRefSignal from "@/signals/localVideoRef";
import Chat from "@/components/screens/Chat";
import Drawer from "@/components/shared/Drawer";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import Loader from "@/components/shared/Loader";
import {Button} from "@/components/ui/button";
import hangup from "@/core/hangup";
import PigGame from "@/components/screens/PigGame";
import RemotePeerIdUpdater from "@/components/connectPage/RemotePeerIdUpdater";

function ConnectScreen() {

    useSignals();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        remoteVideoRefSignal.value = remoteVideoRef;
        localVideoRefSignal.value = localVideoRef;
    }, []);

    useSignalEffect(() => {
        (async () => {
            if (currentRequestSignal.value && peerConnectionSignal.value) {
                await createAnswer({request: currentRequestSignal.value});
            }
        })();
    })

    function renderScreen() {
        if (!statusSignal.value) {
             return <p className={"flex justify-center items-center text-sm md:text-xl size-full"}>
                 برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید
             </p>
        } else if (signalingStateSignal.value === "have-local-offer" && connectionStateSignal.value !== "connecting") {
            return <div className={"flex flex-col gap-5 justify-center items-center text-sm md:text-xl size-full"}>
                <p>
                    در انتظار پاسخ ...
                </p>
                <Button onClick={hangup}>انصراف</Button>
            </div>
        } else if (statusSignal.value === "screen:send") {
            return <ScreenSend/>
        } else if (statusSignal.value.startsWith("audio:") && connectionStateSignal.value === "connected") {
            return <AudioCall/>
        } else if (statusSignal.value.startsWith("video:") || statusSignal.value === "screen:receive") {
            return
        } else if (statusSignal.value?.startsWith("game")) {
            return <PigGame/>
        } else {
            return <div className={"flex flex-col gap-5 justify-center items-center text-sm md:text-xl size-full"}>
                <p>در حال اتصال ...</p>
                <Loader className={"size-8 md:size-10"}/>
            </div>
        }
    }

    return (
        <>
            <Suspense>
                <RemotePeerIdUpdater />
            </Suspense>
            <Drawer openSignal={isChatDrawerOpenSignal} className={"sm:w-1/2"}>
                <Chat/>
            </Drawer>
            <section className={"@container relative overflow-hidden h-[calc(100dvh-146px)]"}>
                {renderScreen()}

                <div
                    className={"absolute top-1 right-1 z-30 max-w-1/3 @lg:max-w-1/4 overflow-hidden"}>
                    <video ref={localVideoRef} autoPlay
                           className={cn("size-full object-contain ", {"hidden": !statusSignal.value?.startsWith("video:") || connectionStateSignal.value !== "connected"})}/>
                </div>

                <div className={"relative size-full overflow-hidden"}>
                    <video ref={remoteVideoRef} autoPlay
                           className={cn("size-full object-contain ", {"hidden": !statusSignal.value?.startsWith("video:") && statusSignal.value !== "screen:receive" || connectionStateSignal.value !== "connected"})}/>
                </div>
            </section>
            <ActionBar/>
        </>
    )
}

export default ConnectScreen;