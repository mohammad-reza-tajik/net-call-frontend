import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import peerConnectionSignal from "@/signals/peer/peerConnection";

async function videoCall() {
    try {
        statusSignal.value = "video:send";

        if (!localStreamSignal.value || !peerConnectionSignal.value) {
            return
        }

        localStreamSignal.value.getTracks().forEach(track => {
            peerConnectionSignal.value.addTrack(track, localStreamSignal.value);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

    } catch (err) {
        console.log(err);
    }

}

export default videoCall;