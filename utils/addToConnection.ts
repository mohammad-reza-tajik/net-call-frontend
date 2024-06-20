import {chatChannelSignal, offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import {batch} from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";
import {TStatus} from "@/types";
import dataChannelListeners from "@/utils/dataChannelListeners";
import chatChannelListeners from "@/utils/chatChannelListeners";

/**
 this function gets the status and tracks that we want to add to the peer connection
 it also creates the chat channel
 */
async function addToConnection(status: TStatus, ...tracks: MediaStreamTrack[]) {
    try {

        if (!chatChannelSignal.value) {
            const chatChannel = peerConnectionSignal.value!.createDataChannel("chat");
            dataChannelListeners(chatChannel);
            chatChannelListeners(chatChannel);
        }

        tracks.forEach((track) => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        })

        const offer = await peerConnectionSignal.value!.createOffer();
        await peerConnectionSignal.value!.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = status;
            offerSignal.value = offer;
        })

    } catch (err) {
        console.error(err);
    }

}

export default addToConnection;