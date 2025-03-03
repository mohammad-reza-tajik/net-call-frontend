import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import {batch} from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";
import type {TStatus} from "@/types";

/**
 this function gets the status and tracks that we want to add to the peer connection
 it also creates the chat channel
 */
async function addToConnection(status: TStatus, ...tracks: MediaStreamTrack[]) {
    try {

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