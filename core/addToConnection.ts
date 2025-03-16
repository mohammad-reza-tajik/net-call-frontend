import { offerSignal, peerConnectionSignal } from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import { batch } from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";
import type { TStatus } from "@/types";
import toast from "react-hot-toast";
import createConnection from "@/core/createConnection";
import dataChannelListeners from "@/core/dataChannelListeners";
import chatChannelListeners from "@/core/chatChannelListeners";

/**
 this function gets the status and tracks that we want to add to the peer connection
 it also creates the chat channel
 */
async function addToConnection(status: TStatus, ...tracks: MediaStreamTrack[]) {
    try {
        peerConnectionSignal.value = createConnection();

        const chatChannel = peerConnectionSignal.value!.createDataChannel("chat");
        dataChannelListeners(chatChannel);
        chatChannelListeners(chatChannel);

        tracks.forEach((track) => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        });

        const offer = await peerConnectionSignal.value!.createOffer();
        await peerConnectionSignal.value!.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = status;
            offerSignal.value = offer;
        });
    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
            console.error(err);
        }
    }
}

export default addToConnection;
