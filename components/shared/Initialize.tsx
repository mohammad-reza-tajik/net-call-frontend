"use client"
import {useEffect} from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import createId from "@/utils/createId";
import localStreamSignal from "@/signals/localStream";
import devicesSignal from "@/signals/devices";
import getDevices from "@/utils/getDevices";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import createConnection from "@/utils/createConnection";
import socketSignal from "@/signals/socket";
import io from "socket.io-client";
import getDeviceType from "@/utils/getDeviceType";
import localPeerId from "@/signals/peer/localPeerId";
import socketListeners from "@/utils/socketListeners";
import peerConnectionListeners from "@/utils/peerConnectionListeners";

function Initialize({children}: {children: React.ReactNode}) {

    useEffect(() => {
        (async () => {
            localPeerIdSignal.value = createId();
            localStreamSignal.value = await navigator.mediaDevices.getUserMedia({audio: true});
            devicesSignal.value = await getDevices();
            peerConnectionSignal.value = createConnection();
            socketSignal.value =io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
                query: {
                    deviceType: getDeviceType(),
                    localPeerId
                }
            }).connect();
            socketListeners();
            peerConnectionListeners();
        })();
    }, []);

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;