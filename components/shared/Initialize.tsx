"use client"
import {useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import createId from "@/utils/createId";
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
            if (typeof navigator.serviceWorker !== "undefined") {
                await navigator.serviceWorker.register("/sw.js");
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {

            const localPeerId = createId(36);
            const localStream = await navigator.mediaDevices.getUserMedia({audio: true});
            const devices = await getDevices();
            const socket = connectToSocket(localPeerId);

            batch(() => {
                localPeerIdSignal.value = localPeerId;
                localStreamSignal.value = localStream;
                devicesSignal.value = devices;
                socketSignal.value = socket;
            })
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