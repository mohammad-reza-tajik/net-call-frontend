import statusSignal from "@/signals/peer/status";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import {batch} from "@preact/signals-react";

async function shareScreen() {
    try {

        const screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});

        if (!peerConnectionSignal.value || !localStreamSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        const [audioTrack] = localStreamSignal.value.getAudioTracks();

        if (audioTrack) {
            screenStream.addTrack(audioTrack);
        }

        screenStream.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, screenStream);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

        batch(() => {
            statusSignal.value = "screen:send";
            offerSignal.value = offer;
        })

    } catch (err) {
        console.log(err);
    }

}

export default shareScreen
