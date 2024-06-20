import statusSignal from "@/signals/peer/status";
import localStreamSignal from "@/signals/localStream";
import {offerSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import localVideoRefSignal from "@/signals/localVideoRef";
import {batch} from "@preact/signals-react";

async function videoCall() {
    try {

        if (!peerConnectionSignal.value || !localStreamSignal.value) {
            throw new Error("no peer connection or local stream");
        }

        localStreamSignal.value.getTracks().forEach(track => {
            peerConnectionSignal.value!.addTrack(track, localStreamSignal.value!);
        });

        const offer = await peerConnectionSignal.value.createOffer();
        await peerConnectionSignal.value.setLocalDescription(offer);

        batch(() => {
            offerSignal.value = offer;
            statusSignal.value = "video:send";
        })

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