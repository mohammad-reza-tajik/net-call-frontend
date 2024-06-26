"use client"
import {useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import localStreamSignal from "@/signals/localStream";
import devicesSignal from "@/signals/devices";
import getDevices from "@/utils/getDevices";
import createConnection from "@/utils/createConnection";
import socketSignal from "@/signals/socket";
import {useSignalEffect} from "@preact/signals-react/runtime";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import {useRouter} from "next/navigation";
import routerSignal from "@/signals/router";
import {batch} from "@preact/signals-react";
import connectToSocket from "@/utils/connectToSocket";

function Initialize({children}: { children: React.ReactNode }) {

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
                let localPeerId = localStorage.getItem("localPeerId");
                if (!localPeerId) {
                    localPeerId = localStream.id;
                    localStorage.setItem("localPeerId", localPeerId);
                }
                const devices = await getDevices();
                const socket = connectToSocket(localPeerId);

                batch(() => {
                    localPeerIdSignal.value = localPeerId;
                    localStreamSignal.value = localStream;
                    devicesSignal.value = devices;
                    socketSignal.value = socket;
                })
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    useSignalEffect(() => {
        if (!peerConnectionSignal.value) {
            createConnection();
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;