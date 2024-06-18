import statusSignal from "@/signals/peer/status";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";

async function shareScreen() {
    try {

        const screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});

        statusSignal.value = "screen:send";

        if (!localStreamSignal.value || !peerConnectionSignal.value) {
            return
        }

        const audioTrack = localStreamSignal.value.getAudioTracks().at(0);

        if (audioTrack) {
            screenStream.addTrack(audioTrack);
        }

        screenStream.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, screenStream);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

        offerSignal.value = offer;


    } catch (err) {
        console.log(err);
    }

}

export default shareScreen
