import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import localStreamSignal from "@/signals/localStream";
import addToConnection from "@/utils/addToConnection";

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

        await addToConnection("screen:send", ...screenStream.getTracks());

    } catch (err) {
        console.log(err);
    }

}

export default shareScreen
