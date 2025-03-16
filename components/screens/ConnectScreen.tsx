"use client";

import AudioCall from "@/components/screens/AudioCall";
import cn from "@/lib/utils/cn";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import { Suspense, useEffect, useRef } from "react";
import createAnswer from "@/core/createAnswer";
import statusSignal from "@/signals/peer/status";
import { connectionStateSignal, signalingStateSignal } from "@/signals/peer/peerConnection";
import currentRequestSignal from "@/signals/peer/currentRequest";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import localVideoRefSignal from "@/signals/localVideoRef";
import Chat from "@/components/screens/Chat";
import Drawer from "@/components/shared/Drawer";
import { isChatDrawerOpenSignal } from "@/signals/drawer";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import hangup from "@/core/hangup";
import PigGame from "@/components/screens/PigGame";
import RemotePeerIdUpdater from "@/components/connectPage/RemotePeerIdUpdater";

function ConnectScreen() {
    useSignals();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        remoteVideoRefSignal.value = remoteVideoRef;
        localVideoRefSignal.value = localVideoRef;
    }, []);

    useSignalEffect(() => {
        if (currentRequestSignal.value) {
            createAnswer({ request: currentRequestSignal.value });
        }
    });

    const renderScreen = () => {
        if (connectionStateSignal.value === "connected") {
            if (statusSignal.value === "screen:send") {
                return <ScreenSend />;
            } else if (statusSignal.value!.startsWith("audio:")) {
                return <AudioCall />;
            } else if (statusSignal.value!.startsWith("video:") || statusSignal.value === "screen:receive") {
                return; // stay on curren screen
            } else if (statusSignal.value?.startsWith("game:")) {
                return <PigGame />;
            }
        } else {
            return (
                <div className={"flex flex-col gap-5 justify-center items-center text-sm md:text-xl size-full"}>
                    {!statusSignal.value && <>برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید</>}
                    {connectionStateSignal.value === "connecting" && (
                        <>
                            <p>در حال اتصال ...</p>
                            <Loader className={"size-10 md:size-12"} />
                        </>
                    )}
                    {signalingStateSignal.value === "have-local-offer" &&
                        connectionStateSignal.value !== "connecting" && (
                            <>
                                <p>در انتظار پاسخ ...</p>
                                <Button onClick={hangup}>انصراف</Button>
                            </>
                        )}
                </div>
            );
        }
    };

    const closeDrawerHandler = () => {
        isChatDrawerOpenSignal.value = false;
    };

    return (
        <>
            <Suspense>
                <RemotePeerIdUpdater />
            </Suspense>
            <Drawer isOpen={isChatDrawerOpenSignal.value} onClose={closeDrawerHandler} direction={"left"} title={"چت"}>
                <Chat />
            </Drawer>
            <section className={"@container relative overflow-hidden h-[calc(100dvh-114px)]"}>
                {renderScreen()}

                <div className={"absolute top-1 right-1 z-30 max-w-1/3 @lg:max-w-1/4 overflow-hidden"}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        className={cn("size-full object-contain ", {
                            hidden:
                                !statusSignal.value?.startsWith("video:") ||
                                connectionStateSignal.value !== "connected",
                        })}
                    />
                </div>

                <div className={"relative size-full overflow-hidden"}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        className={cn("size-full object-contain", {
                            hidden:
                                (!statusSignal.value?.startsWith("video:") &&
                                    statusSignal.value !== "screen:receive") ||
                                connectionStateSignal.value !== "connected",
                        })}
                    />
                </div>
            </section>
            <ActionBar />
        </>
    );
}

export default ConnectScreen;
