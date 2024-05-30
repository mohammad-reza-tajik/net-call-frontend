"use client"
import {useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import createId from "@/utils/createId";
import localStreamSignal from "@/signals/localStream";
import devicesSignal from "@/signals/devices";
import getDevices from "@/utils/getDevices";
import createConnection from "@/utils/createConnection";
import socketSignal from "@/signals/socket";
import io from "socket.io-client";
import getDeviceType from "@/utils/getDeviceType";
import localPeerId from "@/signals/peer/localPeerId";
import socketListeners from "@/utils/socketListeners";
import {useSignalEffect} from "@preact/signals-react/runtime";
import statusSignal from "@/signals/peer/status";
import dataChannelListeners from "@/utils/dataChannelListeners";
import {chatChannelSignal, fileChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";

function Initialize({children}: {children: React.ReactNode}) {

    useEffect(() => {
        (async () => {
            localPeerIdSignal.value = createId();
            localStreamSignal.value = await navigator.mediaDevices.getUserMedia({audio: true});
            devicesSignal.value = await getDevices();
            createConnection();
            socketSignal.value =io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                query: {
                    deviceType: getDeviceType(),
                    localPeerId
                }
            }).connect();
            socketListeners();
        })();
    }, []);

    useSignalEffect(()=>{
        if (statusSignal.value?.endsWith(":send") && !chatChannelSignal.value && !fileChannelSignal.value ){
            const chatChannel = peerConnectionSignal.value?.createDataChannel("chat");
            const fileChannel = peerConnectionSignal.value?.createDataChannel("file");
            dataChannelListeners(chatChannel!);
            dataChannelListeners(fileChannel!);
        }
    })

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;