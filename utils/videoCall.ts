import localStreamSignal from "@/signals/localStream";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import localVideoRefSignal from "@/signals/localVideoRef";
import addToConnection from "@/utils/addToConnection";

async function videoCall() {
    try {

        if (!peerConnectionSignal.value || !localStreamSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        await addToConnection("video:send",...localStreamSignal.value.getTracks());

        if (localVideoRefSignal.value?.current) {
            /*
                we are creating a new stream in a video call because
                we only need the video track to show in local stream
             */
            const localStream = new MediaStream();
            const [videoTrack] = localStreamSignal.value.getVideoTracks();
            localStream.addTrack(videoTrack);
            localVideoRefSignal.value.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}

export default videoCall;