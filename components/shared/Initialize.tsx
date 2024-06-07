"use client"
import {useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import createId from "@/utils/createId";
import localStreamSignal from "@/signals/localStream";
// import devicesSignal from "@/signals/devices";
// import getDevices from "@/utils/getDevices";
import createConnection from "@/utils/createConnection";
import socketSignal from "@/signals/socket";
import io from "socket.io-client";
import getDeviceType from "@/utils/getDeviceType";
import socketListeners from "@/utils/socketListeners";
import {useSignalEffect} from "@preact/signals-react/runtime";
import statusSignal from "@/signals/peer/status";
import dataChannelListeners from "@/utils/dataChannelListeners";
import chatChannelListeners from "@/utils/chatChannelListeners";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import {useRouter} from "next/navigation";
import routerSignal from "@/signals/router";

function Initialize({children}: { children: React.ReactNode }) {

    routerSignal.value = useRouter();

    useEffect(() => {
        (async () => {
            localPeerIdSignal.value = createId(36);
            localStreamSignal.value = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            // devicesSignal.value = await getDevices();
            socketSignal.value = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                query: {
                    deviceType: getDeviceType(),
                    localPeerId : localPeerIdSignal.value
                }
            }).connect();
            socketListeners();
        })();
    }, []);

    useSignalEffect(() => {
        if (!peerConnectionSignal.value) {
            createConnection();
        }
    })

    useSignalEffect(() => {
        if (statusSignal.value?.endsWith(":send") && !chatChannelSignal.value) {
            const chatChannel = peerConnectionSignal.value?.createDataChannel("chat");
            dataChannelListeners(chatChannel!);
            chatChannelListeners(chatChannel!);
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;