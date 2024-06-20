import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import {batch} from "@preact/signals-react";
import statusSignal from "@/signals/peer/status";
import {TStatus} from "@/types";

/**
 this function gets the status and tracks that we want to add to the peer connection
 it also creates a dummy channel before creating offer in order to add it to sdp object
 and when the offer is created it closes the dummy channel
 */
async function addToConnection(status: TStatus, ...tracks: MediaStreamTrack[]) {
    try {

        const dummyChannel = peerConnectionSignal.value?.createDataChannel("dummy");

        tracks.forEach((track) => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        })

        const offer = await peerConnectionSignal.value!.createOffer();
        await peerConnectionSignal.value!.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = status;
            offerSignal.value = offer;
        })

        dummyChannel?.close();

    } catch (err) {
        console.error(err);
    }

}

export default addToConnection;