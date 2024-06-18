import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";

async function audioCall() {
    try {

        statusSignal.value = "audio:send";

        if (!localStreamSignal.value || !peerConnectionSignal.value){
            return
        }

        const [audioTrack] = localStreamSignal.value.getAudioTracks();

        peerConnectionSignal.value.addTrack(audioTrack, localStreamSignal.value);

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);
        offerSignal.value = offer;

    } catch (err) {
        console.log(err);
    }

}

export default audioCall;