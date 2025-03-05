"use client";
import {Suspense, useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import localStreamSignal from "@/signals/localStream";
import iODevicesSignal from "@/signals/iODevices";
import getIODevices from "@/core/getIODevices";
import createConnection from "@/core/createConnection";
import socketSignal from "@/signals/socket";
import {useSignalEffect} from "@preact/signals-react/runtime";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import {useRouter} from "next/navigation";
import routerSignal from "@/signals/router";
import {batch} from "@preact/signals-react";
import connectToSocket from "@/core/connectToSocket";
import HangupOnRouteChange from "@/components/shared/HangupOnRouteChange";
import { type Toast, toast} from "react-hot-toast";
import {Button} from "@/components/ui/button";
import getDeviceType from "@/core/getDeviceType";

interface IProps {
    children: React.ReactNode;
}

function Initialize({children}: IProps) {

    routerSignal.value = useRouter();

    useEffect(() => {
        (async () => {
            try {
                if (typeof navigator.serviceWorker !== "undefined") {
                    await navigator.serviceWorker.register("/sw.js");
                    navigator.serviceWorker.addEventListener("message", (event) => {
                        if (event.data === "activated") {
                            routerSignal.value?.refresh();
                        }
                    });
                }

                const localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

                // this is because we need to request notification permission on a user gesture
                if (Notification.permission !== "granted") {
                    toast((t: Toast) => (
                        <div className={"flex items-center gap-2"}>
                        <p>دسترسی به اعلان مورد نیاز است</p>
                        <Button size={"sm"} className={"text-xs"} onClick={async () => {
                            const permission = await Notification.requestPermission();
                            if (permission !== "granted") {
                                throw new Error("دسترسی به اعلان مورد نیاز است");
                            }
                            toast.dismiss(t.id);
                        }}>
                            دادن مجوز
                        </Button>
                        </div>
                    ) , {id : "notification-permission" , duration : Infinity});

                }

                let localPeerId = localStorage.getItem("localPeerId");
                if (!localPeerId) {
                    localPeerId = localStream.id;
                    localStorage.setItem("localPeerId", localPeerId);
                }
                const deviceType = getDeviceType();
                const devices = await getIODevices();
                const socket = connectToSocket({localPeerId , deviceType});

                batch(() => {
                    localPeerIdSignal.value = localPeerId;
                    localStreamSignal.value = localStream;
                    iODevicesSignal.value = devices;
                    socketSignal.value = socket;
                });
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                    console.error(err);
                }
            }
        })();
    }, []);

    useSignalEffect(() => {
        if (!peerConnectionSignal.value) {
            createConnection();
        }
    });

    return (
        <>
            <Suspense>
                <HangupOnRouteChange/>
            </Suspense>
            {children}
        </>
    );
}

export default Initialize;