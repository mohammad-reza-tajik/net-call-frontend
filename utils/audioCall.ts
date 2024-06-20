import localStreamSignal from "@/signals/localStream";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import addToConnection from "@/utils/addToConnection";

async function audioCall() {
    try {

        if (!localStreamSignal.value || !peerConnectionSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        const [audioTrack] = localStreamSignal.value.getAudioTracks();

        await addToConnection("audio:send",audioTrack);

    } catch (err) {
        console.log(err);
    }

}

export default audioCall;