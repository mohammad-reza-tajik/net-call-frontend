import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import {batch} from "@preact/signals-react";

async function audioCall() {
    try {

        if (!localStreamSignal.value || !peerConnectionSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        const [audioTrack] = localStreamSignal.value.getAudioTracks();

        peerConnectionSignal.value.addTrack(audioTrack, localStreamSignal.value);

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = "audio:send";
            offerSignal.value = offer;
        })

    } catch (err) {
        console.log(err);
    }

}

export default audioCall;