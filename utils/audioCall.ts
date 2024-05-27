import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import peerConnectionSignal from "@/signals/peer/peerConnection";

async function audioCall() {
    try {

        statusSignal.value = "audio:send";

        if (!localStreamSignal.value || !peerConnectionSignal.value){
            return
        }

        localStreamSignal.value.getAudioTracks().forEach(track => {
            peerConnectionSignal.value.addTrack(track, localStreamSignal.value);
        });
        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

    } catch (err) {
        console.log(err);
    }

}

export default audioCall;